'use client';

import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import Scene from '../../components/Scene';
import { Stagger, StaggerItem } from '../../components/motion';
import { CONTAINER, PageHero, CTABand } from '../../components/site';

const STORIES = [
  {
    name: 'Zenfulnote',
    tier: 'Enterprise',
    description:
      'A full custom product spanning mobile, web, backend infrastructure, and AI-assisted functionality. Selerim handled the end-to-end build and continues to support the platform as it evolves.',
    highlights: ['End-to-end custom build', 'Mobile, web, and backend', 'AI-enabled functionality', 'Ongoing product support'],
  },
  {
    name: 'CQ Technologies',
    tier: 'Enterprise',
    description:
      'A dependable mobile workflow for field operations, reporting, and internal coordination, built to support inspection work, report generation, and synchronized operational data.',
    highlights: ['Operational workflow tooling', 'Mobile-first field capture', 'Custom reporting flow', 'Internal team enablement'],
  },
  {
    name: 'ViaSync',
    tier: 'Starter',
    description:
      'A lean, startup-friendly mobile application focused on helping users connect and coordinate smoothly. Shipped quickly on a constrained budget and supported as the product grows.',
    highlights: ['Starter-plan delivery', 'Lean mobile product build', 'Fast launch timeline', 'Ongoing support'],
  },
];

export default function SuccessPage() {
  return (
    <>
      <Scene tone="dark">
        <PageHero
          eyebrow="Success stories"
          title="Real products, real"
          accent="outcomes."
          subtitle="A closer look at teams we partnered with and what we shipped together."
        />
      </Scene>

      <Scene tone="light">
        <div className={`${CONTAINER} space-y-4 py-16 md:py-24`}>
          <Stagger className="grid grid-cols-1 gap-4">
            {STORIES.map((story) => (
              <StaggerItem key={story.name}>
                <article className="glass-card grid grid-cols-1 gap-8 p-8 transition-transform duration-500 hover:-translate-y-1 md:grid-cols-[1fr_1px_1fr] md:p-12">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-medium tracking-tight text-ink">{story.name}</h2>
                      <span className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-wider text-ink-muted">
                        {story.tier}
                      </span>
                    </div>
                    <p className="mt-5 text-[0.97rem] leading-relaxed text-ink-muted">{story.description}</p>
                  </div>
                  <div className="hidden bg-[var(--line)] md:block" />
                  <ul className="grid grid-cols-1 gap-3 self-center sm:grid-cols-2 md:grid-cols-1">
                    {story.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-3 text-[0.95rem] text-ink">
                        <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Scene>

      <Scene tone="dark">
        <CTABand eyebrow="Your story next" title="Let’s build something worth" accent="showing." />
      </Scene>
    </>
  );
}
