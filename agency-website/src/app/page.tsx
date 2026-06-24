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
  ArrowUpRightIcon,
} from '@heroicons/react/24/outline';
import AIHero from '../components/AIHero';
import TestimonialCarousel from '../components/TestimonialCarousel';
import { Reveal, Stagger, StaggerItem } from '../components/motion';
import { CONTAINER, SectionHeader } from '../components/site';
import { siteCopy } from '../config/siteCopy';
import { bookingLinkProps } from '../lib/links';

const WHAT_WE_BUILD = [
  {
    icon: SparklesIcon,
    title: 'AI product features',
    body: 'User-facing AI inside your app: assistants, copilots, smart search, generation, and recommendations.',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Internal AI assistants',
    body: 'Tools for your team that answer questions and take actions across the systems you already run.',
  },
  {
    icon: BoltIcon,
    title: 'Agentic workflow automation',
    body: 'Agents that complete real multi-step tasks, with human approval wherever it matters.',
  },
  {
    icon: CircleStackIcon,
    title: 'RAG / company knowledge systems',
    body: 'Knowledge assistants grounded in your own documents, data, and policies, not the open internet.',
  },
  {
    icon: PuzzlePieceIcon,
    title: 'MCP-style tool & data layers',
    body: 'A secure access layer so AI can read your data and call your tools with the right permissions.',
  },
  {
    icon: WrenchScrewdriverIcon,
    title: 'Existing app modernization',
    body: 'Add AI to the product you already have, on your current stack, without a ground-up rebuild.',
  },
];

const HOW_IT_WORKS = [
  { title: 'Tell us your product or workflow', body: 'Share what you are building, what is manual today, or where your software falls short.' },
  { title: 'We identify the highest-leverage AI opportunities', body: 'We map the use cases that move your metrics, not novelty features.' },
  { title: 'We build the MVP integration', body: 'Production code wired into your real systems, shipped behind your auth.' },
  { title: 'We maintain, improve, and scale it', body: 'Evals, monitoring, and iteration as usage and load grow.' },
];

const TESTIMONIALS = [
  {
    quote:
      'It could not have been done without Selerim. The entire system was built by them end to end, and it has run smoothly at scale without our team needing to manage the engineering side day to day.',
    author: 'Abraham Shaheen',
    role: 'CEO',
    company: 'Zenfulnote',
  },
  {
    quote:
      'ViaSync works super well, and our users were able to sync smoothly from the start. When we ran into a notifications issue, it was reviewed and resolved in less than 24 hours.',
    author: 'Alyssa Pascual',
    role: 'Founder',
    company: 'ViaSync',
  },
  {
    quote:
      'The full scope, build, and delivery has helped our internal team tremendously. Delivery was fast, the quality was top tier, and working with the team was seamless from start to finish.',
    author: 'Joe Kim',
    role: 'Leadership Team',
    company: 'CQ Technologies',
  },
];

export default function Home() {
  return (
    <>
      {/* ===================== INTERACTIVE AI HERO ===================== */}
      <AIHero />

      {/* ===================== WHAT WE BUILD ===================== */}
      <section className={`${CONTAINER} py-20 md:py-28`}>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader eyebrow="What we build" title="AI that plugs into your" accent="real systems." />
          <Reveal delay={0.1}>
            <Link href="/services" className="link-underline inline-flex items-center gap-2 text-base text-ink">
              All services <ArrowUpRightIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHAT_WE_BUILD.map((item) => (
            <StaggerItem key={item.title} className="h-full">
              <div className="glass-card flex h-full flex-col p-7 transition-transform duration-500 hover:-translate-y-1.5">
                <span className="mb-7 flex h-11 w-11 items-center justify-center rounded-xl border border-line text-brand">
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-medium tracking-tight text-ink">{item.title}</h3>
                <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-muted">{item.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className={`${CONTAINER} py-20 md:py-28`}>
        <SectionHeader eyebrow="How it works" title="From idea to AI in" accent="production." />
        <Stagger className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line md:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((step, i) => (
            <StaggerItem key={step.title} className="h-full">
              <div className="group h-full bg-[var(--surface-2)]/40 p-8 transition-colors duration-500 hover:bg-[var(--surface-2)]/70">
                <span className="font-serif text-5xl italic text-ink-subtle transition-colors duration-500 group-hover:text-brand">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6 text-xl font-medium tracking-tight text-ink">{step.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">{step.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ===================== PROOF / CASE STUDIES ===================== */}
      <section className={`${CONTAINER} py-20 md:py-28`}>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader eyebrow="Proof" title="Shipped, in" accent="production." />
          <Reveal delay={0.1}>
            <Link href="/case-studies" className="link-underline inline-flex items-center gap-2 text-base text-ink">
              All case studies <ArrowUpRightIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {siteCopy.home.featuredWork.items.map((item) => (
            <StaggerItem key={item.title} className="h-full">
              <Link href="/case-studies" className="group block h-full">
                <div className="glass-card flex h-full flex-col p-8 transition-transform duration-500 group-hover:-translate-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-medium tracking-tight text-ink">{item.title}</h3>
                    <ArrowUpRightIcon className="h-5 w-5 text-ink-subtle transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
                  </div>
                  <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink-muted">{item.description}</p>
                  <p className="mt-5 text-[0.95rem] font-medium text-ink">{item.outcome}</p>
                  <p className="mt-5 border-t border-line pt-5 text-xs uppercase tracking-wider text-ink-subtle">
                    {item.stack}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-16">
          <TestimonialCarousel testimonials={TESTIMONIALS} />
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className={`${CONTAINER} py-20 md:py-28`}>
        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-[2rem] px-8 py-16 text-center md:px-16 md:py-20">
            <p className="eyebrow mb-5">Founder-led, production-focused</p>
            <h2 className="display mx-auto max-w-3xl text-4xl text-ink-strong sm:text-5xl">
              Want useful AI inside your <span className="accent text-gradient">product or workflow?</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-muted">
              Tell us what you&apos;re building, what&apos;s manual, or what&apos;s breaking. We&apos;ll help
              identify where AI can actually create leverage.
            </p>
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
