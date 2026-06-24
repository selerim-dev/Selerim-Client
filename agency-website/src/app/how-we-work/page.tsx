'use client';

import React from 'react';
import Scene from '../../components/Scene';
import { Stagger, StaggerItem } from '../../components/motion';
import { CONTAINER, PageHero, CheckList, CTABand } from '../../components/site';

const PROCESS = [
  {
    title: 'Discovery & scope',
    description:
      'We learn your goals, constraints, and users, then define a clear scope (fixed-scope sprint or hourly) usually within 24 hours.',
    details: ['Requirements gathering', 'Competitor and user research', 'Scope and timeline definition', 'Risk assessment'],
  },
  {
    title: 'Strategy & planning',
    description:
      'We translate research into a technical plan: architecture, prioritized roadmap, and the right model strategy for your data.',
    details: ['Technical architecture', 'Feature prioritization', 'Model & infra strategy', 'Milestone roadmap'],
  },
  {
    title: 'Design & development',
    description:
      'Production-ready code in agile sprints with full transparency. You get real-time updates, code access, and live previews.',
    details: ['UI/UX and prototyping', 'Agile sprints', 'Live preview & demos', 'QA and testing'],
  },
  {
    title: 'Launch & deployment',
    description:
      'We test thoroughly, optimize, and ship to production with documentation and launch support so handoff is clean.',
    details: ['Final QA', 'Performance optimization', 'Deployment support', 'Post-launch monitoring'],
  },
  {
    title: 'Training & support',
    description:
      'Documentation and training so your team can own the product, with ongoing support available hourly or on retainer.',
    details: ['Docs and training', 'Maintenance', 'Updates & improvements', 'Monitoring'],
  },
  {
    title: 'Growth & optimization',
    description:
      'We keep improving against real usage with analytics, feedback loops, and data-driven iteration as the product evolves.',
    details: ['Analytics & reporting', 'Feedback analysis', 'Continuous improvement', 'Growth planning'],
  },
];

export default function HowWeWorkPage() {
  return (
    <>
      <Scene tone="dark">
        <PageHero
          eyebrow="How we work"
          title="From scope to"
          accent="shipped."
          subtitle="A proven, transparent methodology for turning an idea into a product that holds up in production."
        />
      </Scene>

      <Scene tone="light">
        <div className={`${CONTAINER} py-16 md:py-24`}>
          <Stagger className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {PROCESS.map((step, i) => (
              <StaggerItem key={step.title} className="h-full">
                <div className="glass-card flex h-full flex-col p-8 transition-transform duration-500 hover:-translate-y-1.5 md:p-10">
                  <div className="flex items-baseline gap-4">
                    <span className="font-serif text-5xl italic text-ink-subtle">{String(i + 1).padStart(2, '0')}</span>
                    <h2 className="text-2xl font-medium tracking-tight text-ink">{step.title}</h2>
                  </div>
                  <p className="mt-5 text-[0.97rem] leading-relaxed text-ink-muted">{step.description}</p>
                  <div className="mt-7 border-t border-line pt-7">
                    <CheckList items={step.details} />
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Scene>

      <Scene tone="dark">
        <CTABand eyebrow="Ready when you are" title="Let’s map your" accent="build." />
      </Scene>
    </>
  );
}
