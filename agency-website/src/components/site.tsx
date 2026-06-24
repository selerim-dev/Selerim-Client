'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/outline';
import InstantQuoteForm from './InstantQuoteForm';
import Scene from './Scene';
import { Reveal, Stagger, StaggerItem } from './motion';

export const CONTAINER = 'mx-auto max-w-[1320px] px-5 sm:px-7 lg:px-10';

/** Compact page hero. Clears the fixed header and sets the editorial tone. */
export function PageHero({
  eyebrow,
  title,
  accent,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden pt-36 pb-14 md:pt-44 md:pb-20">
      <div className={CONTAINER}>
        <Reveal>
          <p className="eyebrow mb-6">{eyebrow}</p>
          <h1 className="display max-w-4xl text-[2.6rem] leading-[0.98] text-ink-strong sm:text-6xl md:text-7xl">
            {title}
            {accent ? (
              <>
                {' '}
                <span className="accent text-gradient">{accent}</span>
              </>
            ) : null}
          </h1>
          {subtitle ? (
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-muted md:text-xl">{subtitle}</p>
          ) : null}
          {children ? <div className="mt-9">{children}</div> : null}
        </Reveal>
      </div>
    </header>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  accent,
  subtitle,
  className = '',
  center = false,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  subtitle?: string;
  className?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={`${center ? 'mx-auto text-center' : ''} ${className}`}>
      <p className="eyebrow mb-5">{eyebrow}</p>
      <h2 className={`display text-4xl text-ink sm:text-5xl md:text-[3.2rem] ${center ? 'mx-auto max-w-3xl' : 'max-w-3xl'}`}>
        {title}
        {accent ? (
          <>
            {' '}
            <span className="accent text-gradient">{accent}</span>
          </>
        ) : null}
      </h2>
      {subtitle ? (
        <p className={`mt-5 text-lg text-ink-muted ${center ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>{subtitle}</p>
      ) : null}
    </Reveal>
  );
}

export function CheckList({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[0.95rem] text-ink">
          <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Reusable quote-estimate modal overlay wrapping the InstantQuoteForm. */
export function QuoteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    const handleClose = () => onClose();
    window.addEventListener('closeQuoteModal', handleClose);
    return () => window.removeEventListener('closeQuoteModal', handleClose);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-md sm:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative mx-auto w-full max-w-3xl">
        <InstantQuoteForm />
        <button
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-[var(--surface)]/60 text-ink-muted backdrop-blur transition-colors hover:text-ink"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/** Button that opens the quote-estimate modal. */
export function QuoteButton({
  children,
  variant = 'brand',
  className = '',
}: {
  children: React.ReactNode;
  variant?: 'brand' | 'ghost' | 'primary';
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className={`btn btn-${variant} h-12 px-7 text-base ${className}`}>
        {children}
      </button>
      <QuoteModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/** Long-form legal/policy document layout. */
export function LegalDoc({
  eyebrow,
  title,
  accent,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  updated?: string;
  sections: { h: string; p: React.ReactNode }[];
}) {
  return (
    <Scene tone="dark">
      <PageHero eyebrow={eyebrow} title={title} accent={accent} subtitle={updated} />
      <div className={`${CONTAINER} pb-28`}>
        <Stagger className="mx-auto max-w-3xl divide-y divide-[var(--line)] overflow-hidden rounded-3xl border border-line">
          {sections.map((s, i) => (
            <StaggerItem key={s.h}>
              <div className="bg-[var(--surface-2)]/30 p-8 md:p-10">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-2xl italic text-ink-subtle">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="text-xl font-medium tracking-tight text-ink">{s.h}</h2>
                </div>
                <p className="mt-4 pl-10 text-[0.97rem] leading-relaxed text-ink-muted">{s.p}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Scene>
  );
}

/** Contextual closing CTA used near the bottom of inner pages. */
export function CTABand({
  eyebrow,
  title,
  accent,
  primaryHref = '/contact',
  primaryLabel = 'Book a 15-min intro',
  secondary,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondary?: React.ReactNode;
}) {
  return (
    <div className={`${CONTAINER} py-16 md:py-24`}>
      <Reveal>
        <div className="glass-strong relative overflow-hidden rounded-[2rem] px-8 py-14 text-center md:px-16 md:py-20">
          <p className="eyebrow mb-5">{eyebrow}</p>
          <h2 className="display mx-auto max-w-3xl text-4xl text-ink-strong sm:text-5xl">
            {title}
            {accent ? (
              <>
                {' '}
                <span className="accent text-gradient">{accent}</span>
              </>
            ) : null}
          </h2>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href={primaryHref} className="btn btn-brand h-12 px-7 text-base">
              {primaryLabel}
            </Link>
            {secondary}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
