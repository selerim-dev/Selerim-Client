'use client';

import React from 'react';
import Link from 'next/link';
import {
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  BoltIcon,
  CircleStackIcon,
  PuzzlePieceIcon,
  WrenchScrewdriverIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { Reveal, Stagger, StaggerItem } from '../../components/motion';
import { CONTAINER, PageHero, SectionHeader, CheckList } from '../../components/site';
import { bookingLinkProps } from '../../lib/links';

const SERVICES = [
  {
    icon: SparklesIcon,
    title: 'AI Product Features',
    body: 'Add AI-powered features into existing mobile, web, or backend products: assistants, recommendations, summarization, document workflows, search, personalization, and workflow copilots.',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Internal AI Assistants',
    body: 'Build secure assistants over company knowledge, policies, documents, customer data, or operational workflows, so your team gets answers and takes action faster.',
  },
  {
    icon: BoltIcon,
    title: 'Agentic Workflow Automation',
    body: 'Design agents that reason through multi-step workflows and connect to the tools your team already uses, with human approval wherever it matters.',
  },
  {
    icon: CircleStackIcon,
    title: 'RAG / Company Knowledge Systems',
    body: 'Create retrieval systems over internal data so teams can ask questions, find answers, summarize documents, and make decisions faster.',
  },
  {
    icon: PuzzlePieceIcon,
    title: 'MCP-Style Tool and Data Layers',
    body: 'Create structured tool and data access layers that let AI systems safely interact with business systems, APIs, databases, and internal workflows.',
  },
  {
    icon: WrenchScrewdriverIcon,
    title: 'Existing App Modernization',
    body: 'Improve apps that already exist: performance, reliability, architecture, cloud, APIs, app store readiness, UX cleanup, and AI feature integration.',
  },
  {
    icon: ArrowPathIcon,
    title: 'Ongoing Product Engineering',
    body: 'Ongoing maintenance, scaling, support, and iteration for teams that need senior product engineering without hiring a full-time team.',
  },
];

const PACKAGES = [
  {
    name: 'AI Opportunity Audit',
    price: 'Starting at $5,000',
    positioning: 'For teams that know AI could help but do not know where to start.',
    deliverables: [
      'Review product, workflow, data, and current systems',
      'Identify practical AI opportunities',
      'Prioritize use cases by value and complexity',
      'Recommend MVP scope',
      'Provide an implementation roadmap',
    ],
    featured: false,
  },
  {
    name: 'AI Integration Sprint',
    price: 'Starting at $15,000',
    positioning: 'For teams ready to build one useful AI feature or workflow.',
    deliverables: [
      'Scoped AI feature or internal workflow',
      'API and backend integration',
      'RAG or tool access where appropriate',
      'Production-ready implementation',
      'Testing and deployment support',
    ],
    featured: true,
  },
  {
    name: 'AI Product / Workflow Retainer',
    price: 'Custom · monthly retainers available',
    positioning: 'For teams that need ongoing product engineering, maintenance, support, and AI iteration.',
    deliverables: [
      'Ongoing product improvements',
      'Monitoring and reliability support',
      'AI feature iteration',
      'Backend, mobile, and web improvements',
      'Technical roadmap support',
    ],
    featured: false,
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="AI that plugs into your"
        accent="real systems."
        subtitle="Practical, production-ready AI integration and product engineering. We build into your existing product, stack, and data, then maintain and scale it."
      />

      {/* Services */}
      <section className={`${CONTAINER} py-16 md:py-24`}>
        <SectionHeader eyebrow="What we do" title="Built around higher-value" accent="outcomes." />
        <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <StaggerItem key={service.title} className="h-full">
              <div className="glass-card flex h-full flex-col p-7 transition-transform duration-500 hover:-translate-y-1.5">
                <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-line text-brand">
                  <service.icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-medium tracking-tight text-ink">{service.title}</h3>
                <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-muted">{service.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Productized packages */}
      <section className={`${CONTAINER} py-16 md:py-24`}>
        <SectionHeader
          eyebrow="Packages"
          title="Three clear ways to"
          accent="start."
          subtitle="Every engagement is scoped around your existing product, workflow, data, and business constraints."
        />
        <Stagger className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <StaggerItem key={pkg.name} className="h-full">
              <div
                className={`relative flex h-full flex-col rounded-[22px] p-8 transition-transform duration-500 hover:-translate-y-1.5 ${
                  pkg.featured
                    ? 'border border-brand/40 bg-[var(--surface-2)]/60 shadow-[0_30px_80px_-40px_var(--brand)]'
                    : 'glass-card'
                }`}
              >
                {pkg.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-xs font-medium text-on-brand">
                    Most popular
                  </span>
                )}
                <h3 className="text-xl font-medium tracking-tight text-ink">{pkg.name}</h3>
                <p className="mt-3 font-serif text-2xl italic text-ink">{pkg.price}</p>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-muted">{pkg.positioning}</p>
                <div className="mt-6 flex-1 border-t border-line pt-6">
                  <CheckList items={pkg.deliverables} />
                </div>
                <Link {...bookingLinkProps} className="btn btn-ghost mt-7 h-11 w-full text-sm">
                  Discuss this package
                </Link>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* CTA */}
      <section className={`${CONTAINER} py-16 md:py-24`}>
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
