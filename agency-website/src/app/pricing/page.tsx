'use client';

import React, { useState } from 'react';
import InstantQuoteForm from '../../components/InstantQuoteForm';
import GradientBorder from '../../components/GradientBorder';
import { 
  CheckIcon, 
  RocketLaunchIcon, 
  ClockIcon, 
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  ChartBarIcon,
  SparklesIcon,
  UserGroupIcon,
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline';
import { gradientMain } from '../../config/tokens';

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
    href: '#quote-form',
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
        icon: SparklesIcon,
        text: 'Performance optimization',
        description: 'Optimized for speed and scalability'
      }
    ],
    bestFor: 'Growing businesses ready to scale their digital presence',
    cta: 'Get Started',
    href: '#quote-form',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Full-scale solution with comprehensive support',
    icon: ShieldCheckIcon,
    features: [
      {
        icon: ArrowPathIcon,
        text: '24/7 maintenance',
        description: 'Round-the-clock support and monitoring'
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
        icon: SparklesIcon,
        text: 'Advanced optimization',
        description: 'Maximum performance and scalability'
      },
      {
        icon: UserGroupIcon,
        text: 'Dedicated team',
        description: 'Assigned team members for your project'
      }
    ],
    bestFor: 'Large organizations requiring enterprise-grade solutions',
    cta: 'Contact Us',
    href: '/contact',
  },
];

const services = [
  {
    icon: CodeBracketIcon,
    title: 'Web Development',
    description: 'Custom web applications and websites built with modern technologies.',
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Mobile Apps',
    description: 'Native and cross-platform mobile applications for iOS and Android.',
  },
  {
    icon: PaintBrushIcon,
    title: 'UI/UX Design',
    description: 'Beautiful and intuitive user interfaces that enhance user experience.',
  },
  {
    icon: RocketLaunchIcon,
    title: 'AI Integration',
    description: 'Seamlessly integrate AI capabilities into your existing or new applications.',
  },
];

export default function Pricing() {
  const [showQuote, setShowQuote] = useState(false);

  return (
    <main className="relative min-h-screen bg-dark-blue overflow-x-hidden">
      {/* Blurred background gradients */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-12vw] top-[-12vw] h-[35vw] w-[35vw] rounded-full bg-blue-400/15 blur-[150px]" />
        <div className="absolute right-[-12vw] top-[25vw] h-[30vw] w-[30vw] rounded-full bg-gray-400/15 blur-[150px]" />
        <div className="absolute left-[15vw] bottom-[-12vw] h-[30vw] w-[30vw] rounded-full bg-blue-400/15 blur-[150px]" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Transparent Pricing, Premium Quality
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-white/80">
              Every project is unique. We provide custom solutions tailored to your specific needs, 
              ensuring the highest quality at every step.
            </p>
          </div>
        </div>
      </div>

      {/* Services Overview */}
      <div className="relative z-10 bg-dark-blue py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-8">
              Our Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {services.map((service) => (
                <GradientBorder key={service.title}>
                  <div className="p-6">
                    <service.icon className="h-8 w-8 text-white mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-white/90 mb-2">{service.title}</h4>
                    <p className="text-white/70">{service.description}</p>
                  </div>
                </GradientBorder>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="relative z-10 bg-dark-blue py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-8">
              Choose Your Path
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Our pricing is based on your specific requirements. Each project is unique, 
              and we ensure you get exactly what you need at a fair price.
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
                        <feature.icon className="h-6 w-6 mr-3 text-blue-400 mt-1" />
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

                  <button
                    onClick={() => setShowQuote(true)}
                    className={`w-full rounded-full bg-white/10 text-white hover:bg-white/20 font-semibold px-6 py-3 text-lg transition mt-auto`}
                  >
                    {tier.cta}
                  </button>
                </div>
              </GradientBorder>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="relative z-10 bg-dark-blue py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-8">
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-400 via-fuchsia-400 to-pink-400 p-0.5">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <SparklesIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Premium Quality</h3>
                <p className="text-white/70">We never compromise on quality. Every line of code, every design element, and every feature is crafted to the highest standards.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-400 via-fuchsia-400 to-pink-400 p-0.5">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <ClockIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Fast Delivery</h3>
                <p className="text-white/70">Our streamlined process ensures quick delivery without sacrificing quality. Get to market faster with our efficient development approach.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-400 via-fuchsia-400 to-pink-400 p-0.5">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <ShieldCheckIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Ongoing Support</h3>
                <p className="text-white/70">We're with you every step of the way. From initial development to ongoing maintenance, we ensure your success.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 bg-dark-blue py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-8">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
              Get a custom quote tailored to your specific needs. We'll help you choose the perfect solution for your business.
            </p>
            <button
              onClick={() => setShowQuote(true)}
              className={`rounded-full ${gradientMain} text-white font-bold px-12 py-6 text-2xl shadow hover:opacity-90 transition transform hover:scale-105 duration-300`}
            >
              Get Your Custom Quote
            </button>
          </div>
        </div>
      </div>

      {/* Modal for InstantQuoteForm */}
      {showQuote && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowQuote(false);
            }
          }}
        >
          <div className="relative w-full max-w-2xl mx-auto">
            <InstantQuoteForm />
            <button
              className="absolute top-4 right-4 text-white/60 hover:text-white text-3xl"
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