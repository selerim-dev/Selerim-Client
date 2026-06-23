'use client';

import React from 'react';

/**
 * Plain section wrapper. (Previously drove scroll-based light/dark scene
 * changes; the theme is now a single manual light/dark mode, so `tone` is
 * accepted for API compatibility but no longer affects the theme.)
 */
export default function Scene({
  children,
  className = '',
  id,
}: {
  tone?: 'light' | 'dark';
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}
