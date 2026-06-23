'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowUpRightIcon,
  DevicePhoneMobileIcon,
  CodeBracketIcon,
  CpuChipIcon,
  SparklesIcon,
  ServerIcon,
  CloudIcon,
  CheckIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { siteCopy } from '../config/siteCopy';
import InstantQuoteForm from '../components/InstantQuoteForm';
import TestimonialCarousel from '../components/TestimonialCarousel';
import Scene from '../components/Scene';
import { Reveal, Stagger, StaggerItem, Parallax, WordReveal } from '../components/motion';

const CONTAINER = 'mx-auto max-w-[1320px] px-5 sm:px-7 lg:px-10';

const SERVICE_ICONS = [DevicePhoneMobileIcon, CodeBracketIcon, CpuChipIcon, SparklesIcon];

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

const TRANSPARENCY = [
  {
    img: '/dashboard_images/code_updates.png',
    title: 'Real-time code',
    body: 'See every commit, pull request, and review from day one.',
  },
  {
    img: '/dashboard_images/live_app.png',
    title: 'Live previews',
    body: 'Test features and leave feedback against a real deployment.',
  },
  {
    img: '/dashboard_images/timeline.png',
    title: 'Honest timelines',
    body: 'Milestones and progress tracked in the open, not behind a curtain.',
  },
];

function SectionHeader({
  eyebrow,
  children,
  className = '',
}: {
  eyebrow: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <p className="eyebrow mb-5">{eyebrow}</p>
      <h2 className="display max-w-4xl text-4xl text-ink sm:text-5xl md:text-[3.4rem]">{children}</h2>
    </Reveal>
  );
}

function FAQItem({ item, index }: { item: { question: string; answer: string }; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <StaggerItem>
      <div className="glass-card overflow-hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-4 p-6 text-left"
          aria-expanded={open}
        >
          <span className="flex items-baseline gap-4">
            <span className="text-sm text-ink-subtle">{String(index + 1).padStart(2, '0')}</span>
            <span className="text-lg font-medium tracking-tight text-ink">{item.question}</span>
          </span>
          <ChevronDownIcon
            className={`h-5 w-5 flex-shrink-0 text-ink-muted transition-transform duration-500 ${open ? 'rotate-180' : ''}`}
          />
        </button>
        <div
          className="grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <p className="px-6 pb-6 pl-[3.75rem] text-[0.97rem] leading-relaxed text-ink-muted">{item.answer}</p>
          </div>
        </div>
      </div>
    </StaggerItem>
  );
}

export default function Home() {
  const [showQuote, setShowQuote] = useState(false);
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const handleClose = () => setShowQuote(false);
    window.addEventListener('closeQuoteModal', handleClose);
    return () => window.removeEventListener('closeQuoteModal', handleClose);
  }, []);

  return (
    <>
      {/* ===================== HERO ===================== */}
      <Scene tone="dark">
        <div ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-24">
          <motion.div
            style={reduce ? undefined : { y: heroY, opacity: heroOpacity }}
            className={`${CONTAINER} flex flex-col items-center text-center`}
          >
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="eyebrow mb-7"
            >
              US-based software studio
            </motion.p>

            <h1 className="display text-[2.9rem] leading-[0.96] text-ink-strong sm:text-6xl md:text-7xl lg:text-[5.6rem]">
              <span className="block">
                <WordReveal text="Production-ready AI software," />
              </span>
              <span className="mt-1 block">
                <WordReveal text="built to" delay={0.2} />{' '}
                <motion.span
                  initial={reduce ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduce ? 0 : 0.85, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  className="accent text-gradient inline-block"
                >
                  ship.
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl"
            >
              {siteCopy.home.hero.subheadlineB} Open-source or AWS Bedrock. No vendor lock-in.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-11 flex flex-col items-center gap-4 sm:flex-row"
            >
              <Link href="/contact" className="btn btn-brand px-8 text-base" style={{ height: '3.25rem' }}>
                {siteCopy.home.hero.ctaPrimary}
              </Link>
              <button
                onClick={() => setShowQuote(true)}
                className="btn btn-ghost px-8 text-base"
                style={{ height: '3.25rem' }}
              >
                {siteCopy.home.hero.ctaSecondary}
              </button>
            </motion.div>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
          >
            <span className="eyebrow text-[0.62rem]">Scroll</span>
            <span className="relative flex h-9 w-5 justify-center rounded-full border border-line">
              <span className="animate-scroll-cue mt-1.5 h-1.5 w-1.5 rounded-full bg-ink-muted" />
            </span>
          </motion.div>
        </div>

        {/* Trust strip */}
        <div className={`${CONTAINER} pb-20`}>
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-y border-line py-6">
              {siteCopy.home.trustSignals.map((signal) => (
                <span key={signal} className="flex items-center gap-2 text-sm text-ink-muted">
                  <span className="h-1 w-1 rounded-full bg-brand" />
                  {signal}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </Scene>

      {/* ===================== MANIFESTO (light) ===================== */}
      <Scene tone="light">
        <div className={`${CONTAINER} py-28 md:py-40`}>
          <Reveal>
            <p className="eyebrow mb-8">What we care about</p>
          </Reveal>
          <p className="display max-w-5xl text-3xl leading-[1.18] text-ink sm:text-4xl md:text-5xl">
            <WordReveal text="We care about what happens after launch: software that" />{' '}
            <span className="accent">ships,</span>{' '}
            <WordReveal text="holds up under real users, and" delay={0.1} />{' '}
            <span className="accent">scales.</span>
          </p>
          <Reveal delay={0.15}>
            <Link href="/about" className="link-underline mt-10 inline-flex items-center gap-2 text-base text-ink">
              Read our principles <ArrowUpRightIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </Scene>

      {/* ===================== WHAT WE BUILD (dark) ===================== */}
      <Scene tone="dark">
        <div className={`${CONTAINER} py-24 md:py-32`}>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeader eyebrow="What we build">
              Four things, done <span className="accent">properly.</span>
            </SectionHeader>
            <Reveal delay={0.1}>
              <Link href="/services" className="link-underline inline-flex items-center gap-2 text-base text-ink">
                All services <ArrowUpRightIcon className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {siteCopy.home.servicesOverview.services.map((service, i) => {
              const Icon = SERVICE_ICONS[i] || CodeBracketIcon;
              return (
                <StaggerItem key={service.title}>
                  <Link href="/services" className="group block h-full">
                    <div className="glass-card flex h-full flex-col p-7 transition-transform duration-500 group-hover:-translate-y-1.5">
                      <div className="mb-8 flex items-center justify-between">
                        <Icon className="h-7 w-7 text-ink transition-colors duration-300 group-hover:text-brand" />
                        <span className="text-sm text-ink-subtle">{String(i + 1).padStart(2, '0')}</span>
                      </div>
                      <h3 className="text-xl font-medium tracking-tight text-ink">{service.title}</h3>
                      <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-muted">{service.description}</p>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-ink-subtle transition-colors duration-300 group-hover:text-ink">
                        Explore <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </Scene>

      {/* ===================== HOW WE WORK (light) ===================== */}
      <Scene tone="light">
        <div className={`${CONTAINER} py-24 md:py-32`}>
          <SectionHeader eyebrow="How we work">
            From scope to <span className="accent">shipped.</span>
          </SectionHeader>
          <Stagger className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line md:grid-cols-3">
            {siteCopy.home.howWeWork.steps.map((step, i) => (
              <StaggerItem key={step.title} className="h-full">
                <div className="group h-full bg-[var(--surface-2)]/40 p-9 transition-colors duration-500 hover:bg-[var(--surface-2)]/70">
                  <span className="font-serif text-5xl italic text-ink-subtle transition-colors duration-500 group-hover:text-brand">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-6 text-2xl font-medium tracking-tight text-ink">{step.title}</h3>
                  <p className="mt-3 text-[0.97rem] leading-relaxed text-ink-muted">{step.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Scene>

      {/* ===================== AI APPROACHES (dark) ===================== */}
      <Scene tone="dark">
        <div className={`${CONTAINER} py-24 md:py-32`}>
          <SectionHeader eyebrow="AI approaches" className="mx-auto text-center">
            <span className="mx-auto block">
              Your models. Your data. <span className="accent">Your call.</span>
            </span>
          </SectionHeader>
          <Reveal className="mx-auto mt-4 max-w-2xl text-center">
            <p className="text-lg text-ink-muted">{siteCopy.home.aiApproaches.subtitle}</p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
            {[siteCopy.home.aiApproaches.openSource, siteCopy.home.aiApproaches.bedrock].map((approach, i) => (
              <Reveal key={approach.title} delay={i * 0.1}>
                <div className="glass-card h-full p-9">
                  <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-line text-ink">
                    {i === 0 ? <ServerIcon className="h-6 w-6" /> : <CloudIcon className="h-6 w-6" />}
                  </div>
                  <h3 className="text-2xl font-medium tracking-tight text-ink">{approach.title}</h3>
                  <p className="mt-2 text-[0.97rem] text-ink-muted">{approach.description}</p>
                  <ul className="mt-7 space-y-3">
                    {approach.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-[0.95rem] text-ink">
                        <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 text-center">
            <p className="mx-auto max-w-2xl text-sm text-ink-subtle">{siteCopy.home.aiApproaches.note}</p>
          </Reveal>
        </div>
      </Scene>

      {/* ===================== FEATURED WORK (light) ===================== */}
      <Scene tone="light">
        <div className={`${CONTAINER} py-24 md:py-32`}>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeader eyebrow="Featured work">
              Shipped, in <span className="accent">production.</span>
            </SectionHeader>
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
        </div>
      </Scene>

      {/* ===================== TRANSPARENCY (dark) ===================== */}
      <Scene tone="dark">
        <div className={`${CONTAINER} py-24 md:py-32`}>
          <SectionHeader eyebrow="Total transparency" className="max-w-3xl">
            Your project, your code, your <span className="accent">control</span>, from day one.
          </SectionHeader>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {TRANSPARENCY.map((card, i) => (
              <Reveal key={card.title} delay={i * 0.08}>
                <Parallax speed={0.12 + i * 0.04}>
                  <div className="group overflow-hidden rounded-3xl border border-line">
                    <div className="aspect-[4/3] overflow-hidden bg-[var(--surface-2)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={card.img}
                        alt={card.title}
                        className="h-full w-full object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                      />
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-medium tracking-tight text-ink">{card.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-muted">{card.body}</p>
                </Parallax>
              </Reveal>
            ))}
          </div>
        </div>
      </Scene>

      {/* ===================== TESTIMONIALS (dark) ===================== */}
      <Scene tone="dark">
        <div className={`${CONTAINER} py-24 md:py-32`}>
          <SectionHeader eyebrow="In their words" className="mx-auto text-center">
            <span className="mx-auto block">
              Teams who let us <span className="accent">build.</span>
            </span>
          </SectionHeader>
          <div className="mt-14">
            <TestimonialCarousel testimonials={TESTIMONIALS} />
          </div>
        </div>
      </Scene>

      {/* ===================== FAQ (light) ===================== */}
      <Scene tone="light">
        <div className={`${CONTAINER} py-24 md:py-32`}>
          <SectionHeader eyebrow="Questions">
            Good to <span className="accent">know.</span>
          </SectionHeader>
          <Stagger className="mx-auto mt-12 max-w-3xl space-y-3">
            {siteCopy.home.faq.items.map((item, i) => (
              <FAQItem key={i} item={item} index={i} />
            ))}
          </Stagger>
        </div>
      </Scene>

      {/* ===================== FINAL CTA (dark) ===================== */}
      <Scene tone="dark">
        <div className={`${CONTAINER} pb-10 pt-12 md:pb-16`}>
          <Reveal>
            <div className="glass-strong relative overflow-hidden rounded-[2rem] px-8 py-16 text-center md:px-16 md:py-24">
              <p className="eyebrow mb-6">{siteCopy.home.finalCta.subtitle}</p>
              <h2 className="display mx-auto max-w-3xl text-4xl text-ink-strong sm:text-5xl md:text-6xl">
                Ready to <span className="accent text-gradient">build?</span>
              </h2>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/contact" className="btn btn-brand px-8 text-base" style={{ height: '3.25rem' }}>
                  {siteCopy.home.finalCta.ctaPrimary}
                </Link>
                <button onClick={() => setShowQuote(true)} className="btn btn-ghost px-8 text-base" style={{ height: '3.25rem' }}>
                  {siteCopy.home.finalCta.ctaSecondary}
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </Scene>

      {/* ===================== QUOTE MODAL ===================== */}
      {showQuote && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowQuote(false);
          }}
        >
          <div className="relative mx-auto w-full max-w-3xl">
            <InstantQuoteForm />
            <button
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-[var(--surface)]/60 text-ink-muted backdrop-blur transition-colors hover:text-ink"
              onClick={() => setShowQuote(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
