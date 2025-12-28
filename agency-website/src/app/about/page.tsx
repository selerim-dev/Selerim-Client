'use client';

import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon, SparklesIcon, CodeBracketIcon, ShieldCheckIcon, RocketLaunchIcon, UserGroupIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { siteCopy } from '../../config/siteCopy';
import { gradientMain } from '../../config/tokens';
import GradientBorder from '../../components/GradientBorder';
import InstantQuoteForm from '../../components/InstantQuoteForm';

export default function About() {
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
              {siteCopy.about.story.headline}
            </h1>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="relative z-10 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <GradientBorder hoverIntensity="high">
              <div className="glass-card p-8 md:p-10">
                <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                  {siteCopy.about.story.content}
                </p>
              </div>
            </GradientBorder>
          </div>
        </div>
      </div>

      {/* Key Highlights */}
      <div className="relative z-10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <GradientBorder hoverIntensity="high">
              <div className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl glass-strong flex items-center justify-center mx-auto mb-4">
                  <ClockIcon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">5+ Years Experience</h3>
                <p className="text-white/70 text-sm">Big tech and startup backgrounds</p>
              </div>
            </GradientBorder>
            <GradientBorder hoverIntensity="high">
              <div className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl glass-strong flex items-center justify-center mx-auto mb-4">
                  <SparklesIcon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">AI Integration Specialists</h3>
                <p className="text-white/70 text-sm">Production-ready AI features</p>
              </div>
            </GradientBorder>
            <GradientBorder hoverIntensity="high">
              <div className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl glass-strong flex items-center justify-center mx-auto mb-4">
                  <UserGroupIcon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Non-Technical Teams</h3>
                <p className="text-white/70 text-sm">Our specialty—we translate your vision</p>
              </div>
            </GradientBorder>
            <GradientBorder hoverIntensity="high">
              <div className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl glass-strong flex items-center justify-center mx-auto mb-4">
                  <CodeBracketIcon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Full Engineering Lifecycle</h3>
                <p className="text-white/70 text-sm">From concept to production</p>
              </div>
            </GradientBorder>
            <GradientBorder hoverIntensity="high">
              <div className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl glass-strong flex items-center justify-center mx-auto mb-4">
                  <RocketLaunchIcon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Production-Ready Code</h3>
                <p className="text-white/70 text-sm">Real results, not prototypes</p>
              </div>
            </GradientBorder>
            <GradientBorder hoverIntensity="high">
              <div className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl glass-strong flex items-center justify-center mx-auto mb-4">
                  <ShieldCheckIcon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Vendor Lock-In</h3>
                <p className="text-white/70 text-sm">You control your AI infrastructure</p>
              </div>
            </GradientBorder>
            <GradientBorder hoverIntensity="high">
              <div className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl glass-strong flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Full Transparency</h3>
                <p className="text-white/70 text-sm">Code access from day one</p>
              </div>
            </GradientBorder>
            <GradientBorder hoverIntensity="high">
              <div className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl glass-strong flex items-center justify-center mx-auto mb-4">
                  <ChartBarIcon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Quality & Value</h3>
                <p className="text-white/70 text-sm">Applications that work and scale</p>
              </div>
            </GradientBorder>
          </div>
        </div>
      </div>

      {/* Operating Principles */}
      <div className="relative z-10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {siteCopy.about.principles.title}
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              {siteCopy.about.principles.items.map((principle, index) => (
                <GradientBorder key={index} hoverIntensity="high">
                  <div className="p-6 flex items-start">
                    <div className="w-10 h-10 rounded-2xl glass-strong flex items-center justify-center mr-4 flex-shrink-0">
                      <CheckCircleIcon className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-lg text-white/80">{principle}</p>
                  </div>
                </GradientBorder>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fit Section */}
      <div className="relative z-10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <GradientBorder>
              <div className="p-8">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                  {siteCopy.about.fit.title}
            </h2>
                <div className="space-y-3">
                  {siteCopy.about.fit.items.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-white mr-3 flex-shrink-0 mt-1" />
                      <p className="text-white/80">{item}</p>
          </div>
                  ))}
                </div>
              </div>
            </GradientBorder>
            <GradientBorder>
              <div className="p-8">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                  {siteCopy.about.fit.notFit.title}
                </h2>
                <div className="space-y-3">
                  {siteCopy.about.fit.notFit.items.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <XCircleIcon className="h-5 w-5 text-red-400 mr-3 flex-shrink-0 mt-1" />
                      <p className="text-white/80">{item}</p>
              </div>
            ))}
                </div>
              </div>
            </GradientBorder>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="glass-card p-8 max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {siteCopy.about.cta.title}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
                {siteCopy.about.cta.subtitle}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowQuote(true)}
                  className={`rounded-full ${gradientMain} text-white font-bold px-10 py-5 text-xl shadow-lg hover:opacity-90 transition transform hover:scale-105 duration-300 inline-block backdrop-blur-sm glow-on-hover glow-on-click`}
                >
                  {siteCopy.about.cta.button}
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
