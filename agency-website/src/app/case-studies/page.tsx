'use client';

import React from 'react';
import Link from 'next/link';
import { GlobeAltIcon, DevicePhoneMobileIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { siteCopy } from '../../config/siteCopy';
import Scene from '../../components/Scene';
import { Reveal, Stagger, StaggerItem } from '../../components/motion';
import { CONTAINER, PageHero, SectionHeader, QuoteButton, CTABand } from '../../components/site';

export default function CaseStudiesPage() {
  const { intro, caseStudies, deliverables, cta } = siteCopy.work;

  return (
    <>
      <Scene tone="dark">
        <PageHero eyebrow="Work" title="Shipped, in" accent="production." subtitle={intro.subheadline} />
      </Scene>

      <Scene tone="light">
        <div className={`${CONTAINER} space-y-6 py-16 md:py-24`}>
          {caseStudies.map((study, index) => {
            const links = study.links;
            const hasLinks = links && (links.website || links.ios || links.android);
            return (
              <Reveal key={study.title} delay={index === 0 ? 0 : 0.05}>
                <article className="glass-card overflow-hidden p-8 transition-transform duration-500 hover:-translate-y-1 md:p-12">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="font-serif text-2xl italic text-ink-subtle">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-3xl font-medium tracking-tight text-ink md:text-4xl">{study.title}</h2>
                    {study.custom && (
                      <span className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-wider text-ink-muted">
                        Custom build
                      </span>
                    )}
                  </div>

                  <div className="mt-9 grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div>
                      <p className="eyebrow mb-3">Problem</p>
                      <p className="text-[0.97rem] leading-relaxed text-ink-muted">{study.problem}</p>
                    </div>
                    <div>
                      <p className="eyebrow mb-3">Solution</p>
                      <p className="text-[0.97rem] leading-relaxed text-ink-muted">{study.solution}</p>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 gap-8 border-t border-line pt-8 md:grid-cols-2">
                    <div>
                      <p className="eyebrow mb-3">Outcome</p>
                      <p className="text-[0.97rem] leading-relaxed text-ink">{study.outcome}</p>
                    </div>
                    <div>
                      <p className="eyebrow mb-3">Stack</p>
                      <p className="text-[0.97rem] leading-relaxed text-ink-subtle">{study.stack}</p>
                    </div>
                  </div>

                  {hasLinks && (
                    <div className="mt-9 flex flex-wrap gap-3">
                      {links?.website && (
                        <Link href={links.website} target="_blank" rel="noopener noreferrer" className="btn btn-ghost h-10 px-4 text-sm">
                          <GlobeAltIcon className="h-4 w-4" /> Website
                        </Link>
                      )}
                      {links?.ios && (
                        <Link href={links.ios} target="_blank" rel="noopener noreferrer" className="btn btn-ghost h-10 px-4 text-sm">
                          <DevicePhoneMobileIcon className="h-4 w-4" /> App Store
                        </Link>
                      )}
                      {links?.android && (
                        <Link href={links.android} target="_blank" rel="noopener noreferrer" className="btn btn-ghost h-10 px-4 text-sm">
                          <DevicePhoneMobileIcon className="h-4 w-4" /> Play Store
                        </Link>
                      )}
                    </div>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </Scene>

      <Scene tone="dark">
        <div className={`${CONTAINER} py-20 md:py-28`}>
          <SectionHeader eyebrow="Every engagement" title="What you" accent="get." />
          <Stagger className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line sm:grid-cols-2 lg:grid-cols-3">
            {deliverables.items.map((item) => (
              <StaggerItem key={item} className="h-full">
                <div className="flex h-full items-center gap-3 bg-[var(--surface-2)]/30 p-6 text-[0.95rem] text-ink transition-colors duration-500 hover:bg-[var(--surface-2)]/60">
                  <ArrowUpRightIcon className="h-4 w-4 flex-shrink-0 text-brand" />
                  {item}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Scene>

      <Scene tone="dark">
        <CTABand
          eyebrow={cta.subtitle}
          title="Have a similar"
          accent="project?"
          primaryLabel={cta.button}
          secondary={<QuoteButton variant="ghost">Get a project estimate</QuoteButton>}
        />
      </Scene>
    </>
  );
}
