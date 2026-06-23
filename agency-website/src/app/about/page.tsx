'use client';

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { siteCopy } from '../../config/siteCopy';
import Scene from '../../components/Scene';
import { Reveal, Stagger, StaggerItem } from '../../components/motion';
import { CONTAINER, PageHero, SectionHeader, CheckList, QuoteButton, CTABand } from '../../components/site';

const HIGHLIGHTS = [
  { k: '5+ yrs', v: 'Big-tech and startup engineering backgrounds' },
  { k: 'AI-native', v: 'Production AI features, not demos' },
  { k: 'No lock-in', v: 'You own your models and infrastructure' },
  { k: 'Day one', v: 'Full code access and transparency' },
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

      <Scene tone="dark">
        <CTABand
          eyebrow={cta.subtitle}
          title="Think we’re a"
          accent="fit?"
          secondary={<QuoteButton variant="ghost">Get a project estimate</QuoteButton>}
        />
      </Scene>
    </>
  );
}
