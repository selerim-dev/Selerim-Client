'use client';

import React from 'react';
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/outline';
import { siteCopy } from '../../config/siteCopy';
import Scene from '../../components/Scene';
import { Stagger, StaggerItem } from '../../components/motion';
import { CONTAINER, PageHero, SectionHeader, CheckList, QuoteButton, QuoteModal, CTABand } from '../../components/site';

const TIERS = [
  {
    name: 'Starter',
    price: 'From $5,000',
    description: 'Validate your idea with a focused, production-ready MVP.',
    features: ['Essential, market-validating features', 'Standard security & SSL', 'Basic maintenance and updates', '2-4 weeks delivery'],
    bestFor: 'Startups validating a concept',
    featured: false,
  },
  {
    name: 'Growth',
    price: 'From $15,000',
    description: 'Scale a validated product with advanced features.',
    features: ['Custom functionality & integrations', 'Performance optimization', 'Enhanced security & monitoring', 'Priority maintenance', '1-3 months delivery'],
    bestFor: 'Teams ready to scale',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Full-scale solution with comprehensive support.',
    features: ['Tailored, complex requirements', 'Dedicated support options', 'Custom architecture & SLAs', 'Defined milestones', 'Ongoing partnership'],
    bestFor: 'Established orgs with complex needs',
    featured: false,
  },
];

const ENGAGEMENT = [
  siteCopy.services.engagementModels.hourly,
  siteCopy.services.engagementModels.sprint,
  siteCopy.services.engagementModels.fixed,
];

export default function PricingPage() {
  const [quoteOpen, setQuoteOpen] = React.useState(false);

  return (
    <>
      <Scene tone="dark">
        <PageHero
          eyebrow="Pricing"
          title="Transparent starting points,"
          accent="custom scope."
          subtitle="Every project is quoted to your requirements. These tiers are common starting points, not boxes you have to fit in."
        />
      </Scene>

      <Scene tone="light">
        <div className={`${CONTAINER} py-16 md:py-24`}>
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
                  <h3 className="text-xl font-medium tracking-tight text-ink">{tier.name}</h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-muted">{tier.description}</p>
                  <p className="mt-6 font-serif text-4xl italic text-ink">{tier.price}</p>
                  <div className="mt-7 flex-1 border-t border-line pt-7">
                    <CheckList items={tier.features} />
                  </div>
                  <p className="mt-7 text-xs text-ink-subtle">Best for: {tier.bestFor}</p>
                  <div className="mt-6">
                    {tier.name === 'Enterprise' ? (
                      <Link href="/contact" className="btn btn-ghost h-12 w-full text-base">
                        Talk to us
                      </Link>
                    ) : (
                      <QuoteButton variant={tier.featured ? 'brand' : 'ghost'} className="w-full">
                        Get a quote
                      </QuoteButton>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-8 text-center text-sm text-ink-subtle">
            All pricing is customized based on your specific requirements.
          </p>
        </div>
      </Scene>

      <Scene tone="dark">
        <div className={`${CONTAINER} py-20 md:py-28`}>
          <SectionHeader eyebrow="Engagement" title="Or work by the" accent="model that fits." center />
          <Stagger className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {ENGAGEMENT.map((model) => (
              <StaggerItem key={model.title} className="h-full">
                <div className="glass-card flex h-full flex-col p-8 transition-transform duration-500 hover:-translate-y-1.5">
                  <h3 className="text-2xl font-medium tracking-tight text-ink">{model.title}</h3>
                  <p className="mt-2 text-[0.95rem] text-ink-muted">{model.description}</p>
                  <p className="mt-5 text-sm font-medium text-brand">{model.pricing}</p>
                  <ul className="mt-7 space-y-3">
                    {model.bestFor.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-[0.95rem] text-ink">
                        <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Scene>

      <Scene tone="dark">
        <CTABand
          eyebrow="Tailored to you"
          title="Get a custom"
          accent="quote."
          secondary={
            <button onClick={() => setQuoteOpen(true)} className="btn btn-ghost h-12 px-7 text-base">
              Get a project estimate
            </button>
          }
        />
        <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
      </Scene>
    </>
  );
}
