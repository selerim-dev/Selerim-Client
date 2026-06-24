'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  SparklesIcon,
  PuzzlePieceIcon,
  ServerStackIcon,
  BoltIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  CheckIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { Reveal } from './motion';

const CONTAINER = 'mx-auto max-w-[1320px] px-5 sm:px-7 lg:px-10';

const EXAMPLES = [
  'How can I add AI to my healthcare workflow?',
  'Automate intake and document review for my lending business',
  'Add an AI assistant to my mobile app',
  'Use my company data to answer internal questions',
  'Build an agent that connects to my CRM and backend',
];

const STEPS = [
  'Reading your idea',
  'Mapping your workflows',
  'Identifying AI opportunities',
  'Designing the integration layer',
  'Drafting an MVP plan',
];

const CHIPS = [
  'Add an AI assistant to my app',
  'Automate intake and document review',
];

type Strategy = {
  headline: string;
  opportunity: string;
  integration: string;
  connections: string[];
  agenticWorkflow: string;
  mvpPlan: string[];
  whySelerim: string;
};

type Status = 'idle' | 'loading' | 'result' | 'error';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Type, pause, delete, advance to the next phrase. */
function useTypewriter(phrases: string[], enabled: boolean) {
  const [text, setText] = useState('');
  useEffect(() => {
    if (!enabled) {
      setText('');
      return;
    }
    let phrase = 0;
    let char = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = phrases[phrase];
      if (!deleting) {
        char += 1;
        setText(current.slice(0, char));
        if (char >= current.length) {
          deleting = true;
          timer = setTimeout(tick, 2000);
          return;
        }
        timer = setTimeout(tick, 34 + Math.random() * 36);
      } else {
        char -= 1;
        setText(current.slice(0, char));
        if (char <= 0) {
          deleting = false;
          phrase = (phrase + 1) % phrases.length;
          timer = setTimeout(tick, 420);
          return;
        }
        timer = setTimeout(tick, 18);
      }
    };
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [enabled, phrases]);
  return text;
}

/** Emphasize the first sentence to make a block easier to scan. */
function ProseSection({ text }: { text: string }) {
  const match = text.match(/^([\s\S]*?[.!?])(\s+)([\s\S]*)$/);
  const lead = match ? match[1] : text;
  const rest = match ? match[3] : '';
  return (
    <p className="text-[1.02rem] leading-relaxed text-ink-muted">
      <span className="text-ink">{lead}</span>
      {rest ? ` ${rest}` : ''}
    </p>
  );
}

/** A section on the vertical strategy timeline. Reveals as it scrolls into view. */
function TimelineItem({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof SparklesIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal y={26} className="group relative pb-12 last:pb-1">
      <span className="absolute -left-12 top-0 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-line bg-[var(--surface)] text-brand shadow-[0_0_0_5px_var(--surface)] transition-all duration-500 group-hover:border-brand group-hover:shadow-[0_0_0_5px_var(--surface),0_0_22px_-4px_var(--brand)] sm:-left-14 sm:h-[34px] sm:w-[34px]">
        <Icon className="h-4 w-4" />
      </span>
      <p className="text-[0.78rem] font-medium uppercase tracking-[0.18em] text-brand">{title}</p>
      <div className="mt-3 text-[1.02rem]">{children}</div>
    </Reveal>
  );
}

export default function AIHero() {
  const [idea, setIdea] = useState('');
  const [focused, setFocused] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [step, setStep] = useState(0);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [demo, setDemo] = useState(false);
  const [error, setError] = useState('');
  const reduce = useReducedMotion();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 0.45', 'end 0.6'] });
  const spineFill = useTransform(scrollYProgress, [0, 1], [0.05, 1]);

  const showPlaceholder = status === 'idle' && !focused && idea.length === 0;
  const typed = useTypewriter(EXAMPLES, showPlaceholder);

  // Flow the page to the loader on submit, then to the results when they land.
  useEffect(() => {
    const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth';
    if (status === 'loading') {
      const t = setTimeout(() => loadingRef.current?.scrollIntoView({ behavior, block: 'center' }), 70);
      return () => clearTimeout(t);
    }
    if (status === 'result') {
      const t = setTimeout(() => resultRef.current?.scrollIntoView({ behavior, block: 'start' }), 90);
      return () => clearTimeout(t);
    }
  }, [status, reduce]);

  async function submit() {
    const value = idea.trim();
    if (!value || status === 'loading') return;
    setStatus('loading');
    setStep(0);
    setError('');
    const started = Date.now();
    const interval = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 720);

    try {
      const res = await fetch('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Could not generate a strategy.');

      const minMs = 3100;
      const elapsed = Date.now() - started;
      if (elapsed < minMs) await new Promise((r) => setTimeout(r, minMs - elapsed));
      clearInterval(interval);
      setStrategy(data.strategy);
      setDemo(Boolean(data.demo));
      setStatus('result');
    } catch (e) {
      clearInterval(interval);
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  function reset() {
    setStatus('idle');
    setStrategy(null);
    setError('');
    setIdea('');
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      <div className={`${CONTAINER} flex flex-col items-center text-center`}>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="eyebrow mb-6"
        >
          Production-ready AI integration
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
          className="display max-w-3xl text-[2.5rem] leading-[0.98] text-ink-strong sm:text-6xl md:text-[4.1rem]"
        >
          Where does AI actually fit in your <span className="accent text-gradient">business?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg"
        >
          Describe your product or business. Selerim maps the highest-leverage AI: agents wired to your
          real systems, RAG over your company data, MCP-style tool layers, and internal automation.
        </motion.p>

        {/* Prompt box */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
          className="mt-10 w-full max-w-2xl"
        >
          <div className="prompt-box glass-strong relative rounded-[1.75rem] p-2 text-left">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={idea}
                onChange={(e) => setIdea(e.target.value.slice(0, 600))}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                rows={2}
                disabled={status === 'loading'}
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
                spellCheck={false}
                aria-label="Describe your product or business idea"
                className="block w-full resize-none rounded-2xl bg-transparent px-5 pt-4 pb-2 text-lg leading-relaxed text-ink outline-none disabled:opacity-60"
              />
              {showPlaceholder && (
                <div className="pointer-events-none absolute left-5 top-4 text-lg leading-relaxed text-ink-subtle">
                  {typed}
                  <span className="type-caret" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 px-3 pb-1.5 pt-1">
              <span className="hidden text-xs text-ink-subtle sm:block">
                Press Enter to generate. Shift + Enter for a new line.
              </span>
              <button
                onClick={submit}
                disabled={status === 'loading' || idea.trim().length === 0}
                className="btn btn-brand loop-border ml-auto h-11 px-5 text-[0.95rem] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'loading' ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 animate-spin" /> Analyzing
                  </>
                ) : (
                  <>
                    Generate AI strategy <ArrowRightIcon className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Example chips */}
          {status === 'idle' && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              {CHIPS.map((ex) => (
                <button
                  key={ex}
                  onClick={() => {
                    setIdea(ex);
                    requestAnimationFrame(() => textareaRef.current?.focus());
                  }}
                  className="chip px-4 py-2 text-[0.8rem]"
                >
                  <SparklesIcon className="h-3.5 w-3.5 text-brand" />
                  {ex}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Loading / result / error */}
        <div className="w-full max-w-2xl">
          {status === 'loading' && (
            <motion.div
              ref={loadingRef}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="glass-card mt-12 scroll-mt-28 overflow-hidden p-7 text-left md:p-8"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="eyebrow">Analyzing your idea</p>
                <span className="text-xs tabular-nums text-ink-subtle">
                  {Math.round(((step + 1) / STEPS.length) * 100)}%
                </span>
              </div>
              <div className="mb-7 h-[3px] w-full overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-4 via-brand to-brand-2 transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                />
              </div>
              <ul className="space-y-3.5">
                {STEPS.map((label, i) => {
                  if (i > step) return null;
                  const done = i < step;
                  return (
                    <li key={label} className="animate-fade-in-up flex items-center gap-3">
                      <span
                        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border transition-colors duration-500 ${
                          done ? 'border-brand bg-brand text-on-brand' : 'border-brand text-brand'
                        }`}
                      >
                        {done ? (
                          <CheckIcon className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
                        )}
                      </span>
                      <span
                        className={`text-[0.97rem] transition-colors duration-500 ${done ? 'text-ink-muted' : 'text-ink'}`}
                      >
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card mt-12 p-7 text-left"
            >
              <p className="text-ink">{error}</p>
              <button onClick={() => submit()} className="btn btn-ghost mt-5 h-10 px-5 text-sm">
                <ArrowPathIcon className="h-4 w-4" /> Try again
              </button>
            </motion.div>
          )}

          {status === 'result' && strategy && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-12 scroll-mt-28 text-left"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <p className="eyebrow">AI strategy preview</p>
                  {demo && (
                    <span className="rounded-full border border-line px-2.5 py-0.5 text-[0.62rem] uppercase tracking-wider text-ink-subtle">
                      Demo mode
                    </span>
                  )}
                </div>
                <button onClick={reset} className="link-underline text-sm">
                  Try another idea
                </button>
              </div>

              <p className="max-w-xl font-serif text-[1.85rem] italic leading-[1.15] sm:text-[2.4rem]">
                <span className="text-gradient">{strategy.headline}</span>
              </p>

              <div ref={timelineRef} className="relative mt-12 pl-12 sm:pl-14">
                {/* spine track + scroll-driven fill */}
                <div className="pointer-events-none absolute bottom-1 left-[15px] top-1 w-px bg-line sm:left-[17px]" />
                <motion.div
                  style={{ scaleY: reduce ? 1 : spineFill }}
                  className="pointer-events-none absolute left-[15px] top-1 h-[calc(100%-0.5rem)] w-px origin-top bg-gradient-to-b from-brand via-brand-2 to-brand-3 sm:left-[17px]"
                />

                <TimelineItem icon={SparklesIcon} title="AI opportunity">
                  <ProseSection text={strategy.opportunity} />
                </TimelineItem>

                <TimelineItem icon={PuzzlePieceIcon} title="Suggested integration">
                  <ProseSection text={strategy.integration} />
                </TimelineItem>

                <TimelineItem icon={ServerStackIcon} title="Systems to connect">
                  <div className="flex flex-wrap gap-2">
                    {strategy.connections.map((c) => (
                      <span
                        key={c}
                        className="rounded-lg border border-line bg-[var(--surface-2)]/40 px-3 py-1.5 text-sm text-ink backdrop-blur-sm"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </TimelineItem>

                <TimelineItem icon={BoltIcon} title="Agentic workflow">
                  <ProseSection text={strategy.agenticWorkflow} />
                </TimelineItem>

                <TimelineItem icon={RocketLaunchIcon} title="MVP build plan">
                  <ol className="space-y-3.5">
                    {strategy.mvpPlan.map((stepText, i) => (
                      <li key={stepText} className="flex gap-4 leading-relaxed text-ink">
                        <span className="text-gradient font-serif text-2xl italic leading-none">{i + 1}</span>
                        <span className="pt-0.5">{stepText}</span>
                      </li>
                    ))}
                  </ol>
                </TimelineItem>

                <TimelineItem icon={ShieldCheckIcon} title="Why Selerim">
                  <ProseSection text={strategy.whySelerim} />
                </TimelineItem>
              </div>

              <Reveal y={24}>
                <div className="glass-strong card-glow mt-4 flex flex-col items-center justify-between gap-5 rounded-3xl p-7 text-center sm:flex-row sm:text-left md:p-8">
                  <div>
                    <h3 className="text-xl font-medium tracking-tight text-ink">Want this inside your product?</h3>
                    <p className="mt-1 text-sm text-ink-muted">
                      We&apos;ll turn this into a scoped, production build and maintain it with you.
                    </p>
                  </div>
                  <Link href="/contact" className="btn btn-brand h-12 flex-shrink-0 px-7 text-base">
                    Book a call <ArrowUpRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
