'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteCopy } from '../config/siteCopy';
import { ADMIN_EMAIL } from '../lib/leads';
import { Reveal } from './motion';

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Studio',
    links: [
      { label: 'Work', href: '/case-studies' },
      { label: 'Services', href: '/services' },
      { label: 'How we work', href: '/how-we-work' },
      { label: 'About', href: '/about' },
    ],
  },
  {
    title: 'Engage',
    links: [
      { label: 'Pricing', href: '/pricing' },
      { label: 'Contact', href: '/contact' },
      { label: 'Client login', href: '/login' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-20 border-t border-line">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-7 lg:px-10">
        {/* Closing statement / CTA */}
        <div className="border-b border-line py-16 md:py-24">
          <Reveal>
            <p className="eyebrow mb-6">Let&apos;s build</p>
            <h2 className="display max-w-4xl text-4xl text-ink sm:text-5xl md:text-6xl">
              Have something worth <span className="accent text-gradient">shipping?</span>
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/contact" className="btn btn-brand h-12 px-7 text-base">
                Start a project
              </Link>
              <a href={`mailto:${ADMIN_EMAIL}`} className="link-underline text-base">
                {ADMIN_EMAIL}
              </a>
            </div>
          </Reveal>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="" width={28} height={28} className="brand-mark h-7 w-7 object-contain" />
              <span className="flex items-baseline gap-1.5 leading-none">
                <span className="text-xl font-medium tracking-[-0.04em] text-ink">selerim</span>
                <span className="accent text-base text-ink-subtle">studio</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              {siteCopy.brand.tagline}
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="eyebrow mb-5">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link-underline text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Baseline */}
        <div className="flex flex-col gap-3 border-t border-line py-7 text-sm text-ink-subtle md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {year} {siteCopy.brand.name}. All rights reserved.
          </p>
          <p className="max-w-xl leading-relaxed md:text-right">{siteCopy.legal.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
