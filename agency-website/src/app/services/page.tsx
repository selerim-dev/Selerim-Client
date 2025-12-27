'use client';

import React, { useState } from 'react';
import ServiceCard from '../../components/ServiceCard';
import InstantQuoteForm from '../../components/InstantQuoteForm';
import { 
  CodeBracketIcon, 
  DevicePhoneMobileIcon, 
  RocketLaunchIcon,
  ArrowPathIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { siteCopy } from '../../config/siteCopy';
import { gradientMain } from '../../config/tokens';
import GradientBorder from '../../components/GradientBorder';

const serviceIcons = [
  DevicePhoneMobileIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
  ArrowPathIcon,
  ChartBarIcon,
  ShieldCheckIcon
];

export default function Services() {
  const [showQuote, setShowQuote] = useState(false);

  React.useEffect(() => {
    const handleClose = () => setShowQuote(false);
    window.addEventListener('closeQuoteModal', handleClose);
    return () => window.removeEventListener('closeQuoteModal', handleClose);
  }, []);

  return (
    <main className="relative min-h-screen bg-dark-blue overflow-x-hidden">
      {/* Full screen background gradients */}
      <div className="bg-gradient-fullscreen">
        <div className="absolute left-[-10%] top-[-10%] h-[50vh] w-[50vh] rounded-full bg-blue-400/20 blur-[200px]" />
        <div className="absolute right-[-10%] top-[20%] h-[45vh] w-[45vh] rounded-full bg-purple-400/15 blur-[200px]" />
        <div className="absolute left-[20%] bottom-[-10%] h-[50vh] w-[50vh] rounded-full bg-pink-400/15 blur-[200px]" />
      </div>
      {/* Hero Section */}
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {siteCopy.services.intro.headline}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
              {siteCopy.services.intro.subheadline}
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="relative z-10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {siteCopy.services.categories.map((service, index) => {
              const Icon = serviceIcons[index] || CodeBracketIcon;
              return (
                <GradientBorder key={service.title} hoverIntensity="high">
                  <div className="p-6 h-full">
                    <div className="w-14 h-14 rounded-2xl glass-strong flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-white/70 mb-4 text-sm">{service.description}</p>
                    <ul className="space-y-2">
                      {service.deliverables.map((deliverable, idx) => (
                        <li key={idx} className="flex items-start text-white/80 text-sm">
                          <CheckCircleIcon className="h-4 w-4 text-white mr-2 flex-shrink-0 mt-0.5" />
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </GradientBorder>
              );
            })}
          </div>
        </div>
      </div>

      {/* Engagement Models */}
      <div className="relative z-10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {siteCopy.services.engagementModels.title}
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
            <GradientBorder hoverIntensity="high">
              <div className="p-6 h-full">
                <h3 className="text-xl font-bold text-white mb-3">{siteCopy.services.engagementModels.hourly.title}</h3>
                <p className="text-white/70 mb-4 text-sm">{siteCopy.services.engagementModels.hourly.description}</p>
                <p className="text-white font-semibold mb-4 text-sm">{siteCopy.services.engagementModels.hourly.pricing}</p>
                <p className="text-white/60 text-xs mb-3">Best for:</p>
                <ul className="space-y-2">
                  {siteCopy.services.engagementModels.hourly.bestFor.map((item, idx) => (
                    <li key={idx} className="flex items-start text-white/80 text-xs">
                      <CheckCircleIcon className="h-3 w-3 text-white mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </GradientBorder>
            <GradientBorder hoverIntensity="high">
              <div className="p-6 h-full">
                <h3 className="text-xl font-bold text-white mb-3">{siteCopy.services.engagementModels.sprint.title}</h3>
                <p className="text-white/70 mb-4 text-sm">{siteCopy.services.engagementModels.sprint.description}</p>
                <p className="text-white font-semibold mb-4 text-sm">{siteCopy.services.engagementModels.sprint.pricing}</p>
                <p className="text-white/60 text-xs mb-3">Best for:</p>
                <ul className="space-y-2">
                  {siteCopy.services.engagementModels.sprint.bestFor.map((item, idx) => (
                    <li key={idx} className="flex items-start text-white/80 text-xs">
                      <CheckCircleIcon className="h-3 w-3 text-white mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </GradientBorder>
            <GradientBorder hoverIntensity="high">
              <div className="p-6 h-full">
                <h3 className="text-xl font-bold text-white mb-3">{siteCopy.services.engagementModels.fixed.title}</h3>
                <p className="text-white/70 mb-4 text-sm">{siteCopy.services.engagementModels.fixed.description}</p>
                <p className="text-white font-semibold mb-4 text-sm">{siteCopy.services.engagementModels.fixed.pricing}</p>
                <p className="text-white/60 text-xs mb-3">Best for:</p>
                <ul className="space-y-2">
                  {siteCopy.services.engagementModels.fixed.bestFor.map((item, idx) => (
                    <li key={idx} className="flex items-start text-white/80 text-xs">
                      <CheckCircleIcon className="h-3 w-3 text-white mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </GradientBorder>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="glass-card p-8 max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {siteCopy.services.cta.title}
              </h2>
              <p className="mt-4 text-lg text-white/80">
                {siteCopy.services.cta.subtitle}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowQuote(true)}
                  className={`rounded-full ${gradientMain} text-white font-bold px-10 py-5 text-xl shadow-lg hover:opacity-90 transition transform hover:scale-105 duration-300 inline-block backdrop-blur-sm glow-on-hover glow-on-click`}
                >
                  {siteCopy.services.cta.button}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for InstantQuoteForm */}
      {showQuote && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowQuote(false);
            }
          }}
        >
          <div className="relative w-full max-w-2xl mx-auto">
            <InstantQuoteForm />
            <button
              className="absolute top-4 right-4 text-white/60 hover:text-white text-3xl glow-on-hover z-10"
              onClick={() => setShowQuote(false)}
              aria-label="Close quote form"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
