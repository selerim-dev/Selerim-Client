'use client';

import React from 'react';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem } from '../../components/motion';
import { CONTAINER, PageHero, CheckList } from '../../components/site';
import { bookingLinkProps } from '../../lib/links';

const TIERS = [
  {
    tier: 'Starter',
    name: 'AI Opportunity Audit',
    price: 'Starting at $5,000',
    best: 'Best for teams exploring where AI fits.',
    features: [
      'Discovery across product, workflow, and data',
      'Workflow and current-systems review',
      'Prioritized AI opportunity map',
      'MVP scope recommendation',
      'Implementation roadmap',
    ],
    featured: false,
    cta: { label: 'Book a 15-minute intro', external: true as const },
  },
  {
    tier: 'Growth',
    name: 'AI Integration Sprint',
    price: 'Starting at $15,000',
    best: 'Best for teams ready to build.',
    features: [
      'One scoped AI or product integration',
      'Backend and API work',
      'RAG or tool access where appropriate',
      'Production deployment and testing',
      'Clean handoff',
    ],
    featured: true,
    cta: { label: 'Book a 15-minute intro', external: true as const },
  },
  {
    tier: 'Enterprise',
    name: 'Ongoing Product & AI Engineering',
    price: 'Custom',
    best: 'Best for teams needing ongoing implementation, modernization, support, or multiple AI workflows.',
    features: [
      'Ongoing implementation and iteration',
      'App modernization and reliability',
      'Monitoring and support',
      'Multiple AI workflows',
      'Technical roadmap support',
    ],
    featured: false,
    cta: { label: 'Talk to us', external: false as const },
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Simple starting points,"
        accent="custom scope."
        subtitle="Three clear ways to work together, mapped to AI and product outcomes. Every project is quoted to your requirements."
      />

      <section className={`${CONTAINER} py-16 md:py-24`}>
        <Stagger className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <StaggerItem key={tier.name} className="h-full">
              <div
                className={`relative flex h-full flex-col rounded-[22px] p-8 transition-transform duration-500 hover:-translate-y-1.5 ${
                  tier.featured
                    ? 'border border-brand/40 bg-[var(--surface-2)]/60 shadow-[0_30px_80px_-40px_var(--brand)]'
                    : 'glass-card'
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-xs font-medium text-on-brand">
                    Most popular
                  </span>
                )}
                <p className="eyebrow">{tier.tier}</p>
                <h3 className="mt-2 text-xl font-medium tracking-tight text-ink">{tier.name}</h3>
                <p className="mt-5 font-serif text-3xl italic text-ink">{tier.price}</p>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-muted">{tier.best}</p>
                <div className="mt-6 flex-1 border-t border-line pt-6">
                  <CheckList items={tier.features} />
                </div>
                {tier.cta.external ? (
                  <Link {...bookingLinkProps} className={`btn mt-7 h-12 w-full text-base ${tier.featured ? 'btn-brand' : 'btn-ghost'}`}>
                    {tier.cta.label}
                  </Link>
                ) : (
                  <Link href="/contact" className="btn btn-ghost mt-7 h-12 w-full text-base">
                    {tier.cta.label}
                  </Link>
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-ink-subtle">
          Every engagement is scoped around your existing product, workflow, data, and business constraints.
        </p>
      </section>

      {/* CTA */}
      <section className={`${CONTAINER} pb-16 md:pb-24`}>
        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-[2rem] px-8 py-14 text-center md:px-16 md:py-16">
            <p className="eyebrow mb-5">Not sure what you need?</p>
            <h2 className="display mx-auto max-w-3xl text-3xl text-ink-strong sm:text-4xl">
              Generate an AI strategy, or book a <span className="accent text-gradient">15-minute intro.</span>
            </h2>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/" className="btn btn-brand h-12 px-7 text-base">
                Generate AI strategy
              </Link>
              <Link {...bookingLinkProps} className="btn btn-ghost h-12 px-7 text-base">
                Book a 15-minute intro
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
