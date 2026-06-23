'use client';

import React from 'react';
import {
  DevicePhoneMobileIcon,
  CodeBracketIcon,
  CpuChipIcon,
  SparklesIcon,
  Cog6ToothIcon,
  LifebuoyIcon,
} from '@heroicons/react/24/outline';
import { siteCopy } from '../../config/siteCopy';
import Scene from '../../components/Scene';
import { Stagger, StaggerItem } from '../../components/motion';
import { CONTAINER, PageHero, SectionHeader, CheckList, QuoteButton, CTABand } from '../../components/site';

const SERVICE_ICONS = [
  DevicePhoneMobileIcon,
  CodeBracketIcon,
  CpuChipIcon,
  SparklesIcon,
  Cog6ToothIcon,
  LifebuoyIcon,
];

export default function ServicesPage() {
  const { intro, categories, engagementModels, cta } = siteCopy.services;
  const models = [engagementModels.hourly, engagementModels.sprint, engagementModels.fixed];

  return (
    <>
      <Scene tone="dark">
        <PageHero eyebrow="Services" title="Built to spec, shipped to" accent="production." subtitle={intro.subheadline} />
      </Scene>

      <Scene tone="light">
        <div className={`${CONTAINER} py-20 md:py-28`}>
          <SectionHeader eyebrow="What we do" title="The full" accent="build." />
          <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((service, i) => {
              const Icon = SERVICE_ICONS[i] || CodeBracketIcon;
              return (
                <StaggerItem key={service.title} className="h-full">
                  <div className="glass-card flex h-full flex-col p-7 transition-transform duration-500 hover:-translate-y-1.5">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-line text-ink">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm text-ink-subtle">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="text-xl font-medium tracking-tight text-ink">{service.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-muted">{service.description}</p>
                    <div className="mt-6 border-t border-line pt-6">
                      <CheckList items={service.deliverables} />
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </Scene>

      <Scene tone="dark">
        <div className={`${CONTAINER} py-20 md:py-28`}>
          <SectionHeader eyebrow="Engagement" title="Work with us the way that" accent="fits." center />
          <Stagger className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {models.map((model) => (
              <StaggerItem key={model.title} className="h-full">
                <div className="glass-card flex h-full flex-col p-8 transition-transform duration-500 hover:-translate-y-1.5">
                  <h3 className="text-2xl font-medium tracking-tight text-ink">{model.title}</h3>
                  <p className="mt-2 text-[0.95rem] text-ink-muted">{model.description}</p>
                  <p className="mt-5 text-sm font-medium text-brand">{model.pricing}</p>
                  <p className="mt-7 text-xs uppercase tracking-wider text-ink-subtle">Best for</p>
                  <div className="mt-3">
                    <CheckList items={model.bestFor} />
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Scene>

      <Scene tone="dark">
        <CTABand
          eyebrow={cta.subtitle}
          title="Which model fits your"
          accent="project?"
          secondary={<QuoteButton variant="ghost">{cta.button}</QuoteButton>}
        />
      </Scene>
    </>
  );
}
