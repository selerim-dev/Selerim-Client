'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme, type Scene as SceneTone } from '../lib/theme-context';

/**
 * A section that, while crossing the vertical center of the viewport,
 * sets the active scene tone. In `auto` mode this drives the cinematic
 * light <-> dark transitions on scroll. When the user has locked a theme
 * via the toggle, scenes are still observed but ignored for the resolved
 * theme.
 */
export default function Scene({
  tone,
  children,
  className = '',
  id,
}: {
  tone: SceneTone;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { setScene } = useTheme();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setScene(tone);
        }
      },
      // Only the band crossing the viewport center counts as "active".
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [tone, setScene]);

  return (
    <section ref={ref} id={id} data-scene={tone} className={className}>
      {children}
    </section>
  );
}
