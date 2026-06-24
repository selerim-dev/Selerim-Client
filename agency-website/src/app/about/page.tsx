'use client';

import React from 'react';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { siteCopy } from '../../config/siteCopy';
import Scene from '../../components/Scene';
import { Reveal, Stagger, StaggerItem } from '../../components/motion';
import { CONTAINER, PageHero, SectionHeader, CheckList } from '../../components/site';
import { bookingLinkProps } from '../../lib/links';

const HIGHLIGHTS = [
  { k: 'Big-tech', v: 'Microsoft, Meta, and startup engineering background' },
  { k: 'AI-native', v: 'Production AI features, not demos' },
  { k: 'No lock-in', v: 'You own your models and infrastructure' },
  { k: 'Day one', v: 'Full code access and transparency' },
];

const FOUNDER_COVERS = [
  'Full-stack product engineering',
  'Mobile apps',
  'Web apps',
  'Backend systems',
  'Cloud deployments',
  'AI-enabled workflows',
  'Existing product enhancement',
  'Production maintenance',
];

export default function AboutPage() {
  const { story, principles, fit, cta } = siteCopy.about;

  return (
    <>
      <Scene tone="dark">
        <PageHero eyebrow="Studio" title="A studio built for" accent="execution." subtitle={story.content} />
        <div className={`${CONTAINER} pb-16`}>
          <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {HIGHLIGHTS.map((h) => (
              <StaggerItem key={h.k}>
                <div className="glass-card h-full p-6">
                  <p className="font-serif text-3xl italic text-ink">{h.k}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{h.v}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Scene>

      {/* Founder credibility */}
      <section className={`${CONTAINER} py-16 md:py-24`}>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.05fr] md:items-center">
          <Reveal>
            <p className="eyebrow mb-5">Founder-led</p>
            <h2 className="display text-3xl text-ink sm:text-4xl md:text-5xl">
              Built by a product engineer who has <span className="accent text-gradient">shipped.</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-muted">
              Founder-led by a product engineer with Microsoft, Meta, startup, mobile, backend, and
              production AI experience.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">
              Selerim is built for teams that need someone who can move between product thinking,
              architecture, implementation, deployment, and maintenance.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glass-card p-8 md:p-9">
              <p className="eyebrow mb-6">What that covers</p>
              <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                <CheckList items={FOUNDER_COVERS.slice(0, 4)} />
                <CheckList items={FOUNDER_COVERS.slice(4)} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Scene tone="light">
        <div className={`${CONTAINER} py-20 md:py-28`}>
          <SectionHeader eyebrow="Operating principles" title="How we keep it" accent="honest." />
          <Stagger className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line md:grid-cols-2">
            {principles.items.map((principle, i) => (
              <StaggerItem key={principle} className="h-full">
                <div className="group flex h-full items-start gap-5 bg-[var(--surface-2)]/40 p-8 transition-colors duration-500 hover:bg-[var(--surface-2)]/70">
                  <span className="font-serif text-3xl italic text-ink-subtle transition-colors duration-500 group-hover:text-brand">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="pt-1.5 text-lg leading-relaxed text-ink">{principle}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Scene>

      <Scene tone="dark">
        <div className={`${CONTAINER} py-20 md:py-28`}>
          <SectionHeader eyebrow="Fit" title="Who we work best" accent="with." />
          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Reveal>
              <div className="glass-card h-full p-9">
                <h3 className="text-xl font-medium tracking-tight text-ink">{fit.title}</h3>
                <div className="mt-6">
                  <CheckList items={fit.items} />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="glass-card h-full p-9">
                <h3 className="text-xl font-medium tracking-tight text-ink">{fit.notFit.title}</h3>
                <ul className="mt-6 space-y-3">
                  {fit.notFit.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[0.95rem] text-ink-muted">
                      <XMarkIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-subtle" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </Scene>

      <section className={`${CONTAINER} py-16 md:py-24`}>
        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-[2rem] px-8 py-14 text-center md:px-16 md:py-16">
            <p className="eyebrow mb-5">{cta.subtitle}</p>
            <h2 className="display mx-auto max-w-3xl text-3xl text-ink-strong sm:text-4xl">
              Think we&apos;re a <span className="accent text-gradient">fit?</span>
            </h2>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link {...bookingLinkProps} className="btn btn-brand h-12 px-7 text-base">
                Book a 15-minute intro
              </Link>
              <Link href="/contact" className="btn btn-ghost h-12 px-7 text-base">
                Send an inquiry
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
