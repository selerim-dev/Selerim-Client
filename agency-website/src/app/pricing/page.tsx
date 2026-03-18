'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import InstantQuoteForm from '../../components/InstantQuoteForm';
import GradientBorder from '../../components/GradientBorder';
import { 
  RocketLaunchIcon, 
  ClockIcon, 
  ShieldCheckIcon,
  ArrowPathIcon,
  ChartBarIcon,
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { gradientMain } from '../../config/tokens';
import { siteCopy } from '../../config/siteCopy';

const serviceIcons = [
  DevicePhoneMobileIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
  ArrowPathIcon,
  ChartBarIcon,
  ShieldCheckIcon
];

const pricingTiers = [
  {
    name: 'Starter',
    price: 'From $5,000',
    description: 'Perfect for validating your idea with a minimal viable product',
    icon: RocketLaunchIcon,
    features: [
      {
        icon: ArrowPathIcon,
        text: 'Basic maintenance and updates',
        description: 'Regular security patches and bug fixes'
      },
      {
        icon: ChartBarIcon,
        text: 'Essential features',
        description: 'Core functionality to validate your market'
      },
      {
        icon: ClockIcon,
        text: '2-4 weeks delivery',
        description: 'Quick turnaround for market validation'
      },
      {
        icon: ShieldCheckIcon,
        text: 'Basic security',
        description: 'Standard security measures and SSL'
      }
    ],
    bestFor: 'Startups and small businesses looking to validate their concept',
    cta: 'Get Started',
  },
  {
    name: 'Growth',
    price: 'From $15,000',
    description: 'Scale your validated product with advanced features',
    icon: ChartBarIcon,
    featured: true,
    features: [
      {
        icon: ArrowPathIcon,
        text: 'Priority maintenance',
        description: 'Enhanced support and faster response times'
      },
      {
        icon: ChartBarIcon,
        text: 'Advanced features',
        description: 'Custom functionality and integrations'
      },
      {
        icon: ClockIcon,
        text: '1-3 months delivery',
        description: 'Comprehensive development timeline'
      },
      {
        icon: ShieldCheckIcon,
        text: 'Enhanced security',
        description: 'Advanced security measures and monitoring'
      },
      {
        icon: RocketLaunchIcon,
        text: 'Performance optimization',
        description: 'Optimized for speed and scalability'
      }
    ],
    bestFor: 'Growing businesses ready to scale their digital presence',
    cta: 'Get Started',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Full-scale solution with comprehensive support',
    icon: ShieldCheckIcon,
    features: [
      {
        icon: ArrowPathIcon,
        text: 'Priority support options',
        description: 'Structured support coverage based on project needs'
      },
      {
        icon: ChartBarIcon,
        text: 'Custom features',
        description: 'Tailored solutions for complex requirements'
      },
      {
        icon: ClockIcon,
        text: '3+ months delivery',
        description: 'Extended timeline for complex projects'
      },
      {
        icon: ShieldCheckIcon,
        text: 'Enterprise security',
        description: 'Highest level of security and compliance'
      },
      {
        icon: RocketLaunchIcon,
        text: 'Advanced optimization',
        description: 'Maximum performance and scalability'
      },
      {
        icon: CodeBracketIcon,
        text: 'Dedicated team',
        description: 'Assigned team members for your project'
      }
    ],
    bestFor: 'Large organizations requiring enterprise-grade solutions',
    cta: 'Contact Us',
  },
];

export default function Pricing() {
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
        <div className="absolute right-[30%] top-[50%] h-[40vh] w-[40vh] rounded-full bg-cyan-400/10 blur-[200px]" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Services & Pricing
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-white/80">
              Production-ready development with transparent pricing. Choose the engagement model that fits your needs.
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="relative z-10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              What We Build
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              {siteCopy.services.intro.subheadline}
            </p>
          </div>
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              {siteCopy.services.engagementModels.title}
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Flexible engagement options to match your project needs and timeline
            </p>
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

      {/* Pricing Tiers */}
      <div className="relative z-10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Pricing Tiers
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Starting points for common project types. All pricing is customized based on your specific requirements.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <GradientBorder key={tier.name} hoverIntensity="high" className="h-full">
                <div className="p-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                    <tier.icon className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-xl text-white/70 mb-6">{tier.description}</p>
                  <p className="text-4xl font-bold text-white mb-8">{tier.price}</p>
                  
                  <ul className="space-y-6 mb-8 flex-grow">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <feature.icon className="h-6 w-6 mr-3 text-blue-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-white/90 font-medium">{feature.text}</p>
                          <p className="text-white/60 text-sm">{feature.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <p className="text-white/70 text-sm mb-8">
                    Best for: {tier.bestFor}
                  </p>

                  {tier.name === 'Enterprise' ? (
                    <Link
                      href="/contact"
                      className={`w-full rounded-full glass-button text-white hover:bg-white/20 font-semibold px-6 py-3 text-lg transition mt-auto glow-on-hover glow-on-click text-center block`}
                    >
                      {tier.cta}
                    </Link>
                  ) : (
                    <button
                      onClick={() => setShowQuote(true)}
                      className={`w-full rounded-full ${gradientMain} text-white font-semibold px-6 py-3 text-lg transition mt-auto glow-on-hover glow-on-click`}
                    >
                      {tier.cta}
                    </button>
                  )}
                </div>
              </GradientBorder>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="glass-card p-8 max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Get a custom quote tailored to your specific needs. We'll help you choose the perfect solution for your business.
              </p>
              <button
                onClick={() => setShowQuote(true)}
                className={`rounded-full ${gradientMain} text-white font-bold px-10 py-5 text-xl shadow-lg hover:opacity-90 transition transform hover:scale-105 duration-300 inline-block backdrop-blur-sm glow-on-hover glow-on-click`}
              >
                Get Your Custom Quote
              </button>
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
