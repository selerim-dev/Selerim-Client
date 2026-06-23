'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Reliable in-view detection. Uses framer-motion's useInView for scroll
 * reveals, plus a mount-time safety net: if the element is already within
 * the viewport shortly after mount, reveal it regardless. This guarantees
 * content is never permanently stuck in its hidden state.
 */
function useReveal(ref: React.RefObject<Element | null>, once = true) {
  const inView = useInView(ref, { once, margin: '0px 0px -12% 0px' });
  const [forced, setForced] = useState(false);

  useEffect(() => {
    if (forced) return;
    const check = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95 && r.bottom > 0) setForced(true);
    };
    const t1 = setTimeout(check, 120);
    const t2 = setTimeout(check, 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ref, forced]);

  return inView || forced;
}

/** Fade + rise into view on scroll. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  duration = 0.75,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const show = useReveal(ref, once);
  const variants: Variants = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration, delay, ease: EASE } },
  };
  return (
    <motion.div ref={ref} className={className} variants={variants} initial="hidden" animate={show ? 'show' : 'hidden'}>
      {children}
    </motion.div>
  );
}

/** Stagger container. Pair with <StaggerItem>. */
export function Stagger({
  children,
  className,
  stagger = 0.09,
  delayChildren = 0.05,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const show = useReveal(ref, once);
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  };
  return (
    <motion.div ref={ref} className={className} variants={variants} initial="hidden" animate={show ? 'show' : 'hidden'}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
  };
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}

/** Subtle parallax drift tied to scroll position. */
export function Parallax({
  children,
  className,
  speed = 0.18,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const range = speed * 120;
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);
  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { y }}>
      {children}
    </motion.div>
  );
}

/** Headline that reveals word-by-word. */
export function WordReveal({
  text,
  className,
  delay = 0,
  once = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const show = useReveal(ref, once);
  const words = text.split(' ');
  return (
    <motion.span
      ref={ref}
      className={className}
      initial="hidden"
      animate={show ? 'show' : 'hidden'}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: reduce ? { y: 0, opacity: 1 } : { y: '110%', opacity: 0 },
              show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: EASE } },
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
