'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

const TestimonialCarousel: React.FC<{ testimonials: Testimonial[] }> = ({ testimonials }) => {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, [auto, testimonials.length]);

  const go = (dir: number) => {
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);
    setAuto(false);
  };

  const current = testimonials[index];

  return (
    <div
      className="relative mx-auto max-w-4xl"
      onMouseEnter={() => setAuto(false)}
      onMouseLeave={() => setAuto(true)}
    >
      <div className="glass-card overflow-hidden p-9 md:p-14">
        <span className="block font-serif text-7xl italic leading-none text-ink-faint md:text-8xl" aria-hidden>
          &ldquo;
        </span>
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="-mt-6"
          >
            <p className="text-2xl font-medium leading-relaxed tracking-tight text-ink md:text-[1.7rem]">
              {current.quote}
            </p>
            <footer className="mt-9 flex items-center justify-between border-t border-line pt-6">
              <div>
                <p className="text-base font-medium text-ink">{current.author}</p>
                <p className="mt-0.5 text-sm text-ink-muted">
                  {current.role}, {current.company}
                </p>
              </div>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="mt-7 flex items-center justify-center gap-5">
        <button
          onClick={() => go(-1)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
          aria-label="Previous testimonial"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIndex(i);
                setAuto(false);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index ? 'w-7 bg-ink' : 'w-1.5 bg-ink-faint hover:bg-ink-subtle'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => go(1)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
          aria-label="Next testimonial"
        >
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
