'use client';

import React, { useState } from 'react';
import { siteCopy } from '../../config/siteCopy';
import { gradientMain } from '../../config/tokens';
import GradientBorder from '../../components/GradientBorder';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import InstantQuoteForm from '../../components/InstantQuoteForm';

export default function CaseStudies() {
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
              {siteCopy.work.intro.headline}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
              {siteCopy.work.intro.subheadline}
            </p>
          </div>
        </div>
      </div>

      {/* Case Studies */}
      <div className="relative z-10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {siteCopy.work.caseStudies.map((study, index) => (
              <GradientBorder key={index} hoverIntensity="high">
                <div className="p-10">
                  <h2 className="text-3xl font-bold text-white mb-6">{study.title}</h2>
                  <div className="grid md:grid-cols-2 gap-8 mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Problem</h3>
                      <p className="text-white/70">{study.problem}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Solution</h3>
                      <p className="text-white/70">{study.solution}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Outcome</h3>
                      <p className="text-white font-semibold">{study.outcome}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Stack</h3>
                      <p className="text-white/60">{study.stack}</p>
                    </div>
                  </div>
                </div>
              </GradientBorder>
            ))}
          </div>
        </div>
      </div>

      {/* Deliverables */}
      <div className="relative z-10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {siteCopy.work.deliverables.title}
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              {siteCopy.work.deliverables.items.map((item, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-white mr-3 flex-shrink-0 mt-1" />
                  <span className="text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="glass-card p-8 max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {siteCopy.work.cta.title}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
                {siteCopy.work.cta.subtitle}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowQuote(true)}
                  className={`rounded-full ${gradientMain} text-white font-bold px-10 py-5 text-xl shadow-lg hover:opacity-90 transition transform hover:scale-105 duration-300 inline-block backdrop-blur-sm glow-on-hover glow-on-click`}
                >
                  {siteCopy.work.cta.button}
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
