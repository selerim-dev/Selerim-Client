'use client';

import React, { useRef, useEffect, useState } from 'react';
import ServiceCard from '../components/ServiceCard';
import TestimonialCarousel from '../components/TestimonialCarousel';
import { 
  CodeBracketIcon, 
  DevicePhoneMobileIcon, 
  PaintBrushIcon, 
  ChartBarIcon,
  RocketLaunchIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ServerIcon,
  CloudIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import CompanyLogosCarousel, { CompanyLogo } from '../components/CompanyLogosCarousel';
import TypewriterGradient from '../components/TypewriterGradient';
import InstantQuoteForm from '../components/InstantQuoteForm';
import { gradientMain } from '../config/tokens';
import dynamic from 'next/dynamic';
import type { LottieRefCurrentProps } from 'lottie-react';
import GradientBorder from '../components/GradientBorder';
import { siteCopy } from '../config/siteCopy';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

// FAQ Accordion Component
function FAQAccordion({ faqItems }: { faqItems: Array<{ question: string; answer: string }> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mb-24">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
        {siteCopy.home.faq.title}
      </h2>
      <div className="max-w-4xl mx-auto space-y-4">
        {faqItems.map((item, index) => (
          <GradientBorder key={index}>
            <div className="glass-card overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 flex items-center justify-between text-left glow-on-hover glow-on-click"
              >
                <h3 className="text-xl font-bold text-white pr-4">{item.question}</h3>
                <ChevronDownIcon 
                  className={`h-6 w-6 text-white flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 pt-0 animate-fade-in-up">
                  <p className="text-white/70 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          </GradientBorder>
        ))}
      </div>
    </div>
  );
}

// Import Lottie with no SSR
const Lottie = dynamic(() => import('lottie-react'), { 
  ssr: false,
  loading: () => (
    <div className="w-[140px] h-[140px] bg-black/20 rounded-full animate-pulse" />
  )
});

const services = siteCopy.home.servicesOverview.services.map((service, index) => {
  const icons = [DevicePhoneMobileIcon, CodeBracketIcon, RocketLaunchIcon, ArrowPathIcon];
  return {
    icon: icons[index] || CodeBracketIcon,
    title: service.title,
    description: service.description,
    link: '/pricing',
  };
});

const testimonials = [
  {
    quote: "Working with this agency transformed our digital presence. Their team's expertise and dedication are unmatched. The attention to detail and innovative solutions they provided exceeded our expectations.",
    author: "Sarah Johnson",
    role: "CEO",
    company: "TechStart Inc.",
    image: "/testimonials/sarah.jpg"
  },
  {
    quote: "The mobile app they developed exceeded our expectations. Their attention to detail and user experience is remarkable. The team's ability to understand our vision and translate it into reality was impressive.",
    author: "Michael Chen",
    role: "Product Manager",
    company: "Innovate Solutions",
    image: "/testimonials/michael.jpg"
  },
  {
    quote: "Their digital marketing strategies helped us achieve 3x growth in just six months. Highly recommended! The data-driven approach and creative solutions they implemented were game-changing for our business.",
    author: "Emily Rodriguez",
    role: "Marketing Director",
    company: "Growth Partners",
    image: "/testimonials/emily.jpg"
  },
  {
    quote: "The web application they built for us has streamlined our operations and improved efficiency by 40%. Their technical expertise and project management skills are outstanding.",
    author: "David Kim",
    role: "CTO",
    company: "Enterprise Solutions",
    image: "/testimonials/david.jpg"
  },
  {
    quote: "Working with this team was a pleasure from start to finish. They delivered our project on time and within budget, exceeding our expectations at every step.",
    author: "Lisa Thompson",
    role: "Founder",
    company: "Startup Vision",
    image: "/testimonials/lisa.jpg"
  }
];

// Example logos array (replace with your own)
const companyLogos: CompanyLogo[] = [
  { src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', alt: 'Google', href: 'https://google.com' },
  { src: 'https://www.google.com/search?sca_esv=b9039e3016f1e9d6&rlz=1C5CHFA_enUS1032US1032&sxsrf=AE3TifP1WkTWMoUMKonIW-EiMid5Dcdd3Q:1749770311132&q=masterclass+logo&udm=2&fbs=AIIjpHxU7SXXniUZfeShr2fp4giZ1Y6MJ25_tmWITc7uy4KIeoJTKjrFjVxydQWqI2NcOhZVmrJB8DQUK5IzxA2fZbQF4YL5sNSRJGgx0e9Z9AxEx1bmPbSY3ROQyoKhw9UuuwNOze1rMTfR8LJZdQ9FI96CmdBJWTydVJVILJpUCMhUJaivtxJ0ArVSPoESF5gtgDTwfAIvL61r650S64avOx1wd9u3Yw&sa=X&ved=2ahUKEwiKr9Wugu2NAxVaLdAFHVv5IoAQtKgLegQIGhAB&biw=1512&bih=857&dpr=2#vhid=SQvuaYf8w77iIM&vssid=mosaic', alt: 'MasterClass', href: 'https://masterclass.com' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg', alt: 'Sony', href: 'https://sony.com' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Epson_logo.svg', alt: 'Epson', href: 'https://epson.com' },
  { src: 'https://brandfetch.com/doorspaceinc.com', alt: 'DoorSpace', href: 'https://doorspaceinc.com' },
  { src: 'https://brandfetch.com/mybrightwheel.com', alt: 'Brightwheel', href: 'https://mybrightwheel.com' },
  { src: 'https://seeklogo.com/vector-logo/442110/betterup', alt: 'BetterUp', href: 'https://betterup.com' },
  { src: 'https://seeklogo.com/vector-logo/273876/salesforce', alt: 'Salesforce', href: 'https://salesforce.com' },
  { src: 'https://worldvectorlogo.com/logo/consulting', alt: 'Consulting Partners', href: '#' },
];

const pricingTiers = [
  {
    name: 'Starter',
    description: 'Perfect for validating your idea with a minimal viable product.',
    features: [
      {
        icon: ArrowPathIcon,
        text: 'Basic maintenance'
      },
      {
        icon: ChartBarIcon,
        text: 'Essential features'
      },
      {
        icon: ClockIcon,
        text: '2-4 weeks delivery'
      }
    ]
  },
  {
    name: 'Growth',
    description: 'Scale your validated product with advanced features.',
    features: [
      {
        icon: ArrowPathIcon,
        text: 'Priority maintenance'
      },
      {
        icon: ChartBarIcon,
        text: 'Advanced features'
      },
      {
        icon: ClockIcon,
        text: '1-3 months delivery'
      }
    ]
  },
  {
    name: 'Enterprise',
    description: 'Full-scale solution with comprehensive support.',
    features: [
      {
        icon: ArrowPathIcon,
        text: '24/7 maintenance'
      },
      {
        icon: ChartBarIcon,
        text: 'Custom features'
      },
      {
        icon: ClockIcon,
        text: '3+ months delivery'
      }
    ]
  }
];

export default function Home() {
  const [showQuote, setShowQuote] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animationData, setAnimationData] = useState(null);
  const [error, setError] = useState(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  // Listen for close event from InstantQuoteForm
  useEffect(() => {
    const handleClose = () => setShowQuote(false);
    window.addEventListener('closeQuoteModal', handleClose);
    return () => window.removeEventListener('closeQuoteModal', handleClose);
  }, []);

  useEffect(() => {
    setMounted(true);
    fetch('/lottie/neural_nodes_small.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading Lottie data:', error));
  }, []);

  return (
    <main className="relative min-h-screen bg-dark-blue overflow-x-hidden">
      {/* Full screen blurred background gradients */}
      <div className="bg-gradient-fullscreen">
        <div 
          className="absolute left-[-10%] top-[-10%] h-[50vh] w-[50vh] rounded-full bg-blue-400/20 blur-[200px]"
        />
        <div 
          className="absolute right-[-10%] top-[20%] h-[45vh] w-[45vh] rounded-full bg-purple-400/15 blur-[200px]"
        />
        <div 
          className="absolute left-[20%] bottom-[-10%] h-[50vh] w-[50vh] rounded-full bg-pink-400/15 blur-[200px]"
        />
        <div 
          className="absolute right-[30%] top-[50%] h-[40vh] w-[40vh] rounded-full bg-cyan-400/10 blur-[200px]"
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center pt-8 md:pt-12 pb-20 md:pb-32 px-4 sm:px-6 md:px-8">
        <div className="w-[140px] h-[140px] mx-auto mb-6 bg-black/20 rounded-full">
          {mounted && animationData && (
            <Lottie
              animationData={animationData}
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: '100%' }}
              rendererSettings={{
                preserveAspectRatio: 'xMidYMid slice',
                progressiveLoad: true,
                hideOnTransparent: true
              }}
            />
          )}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 max-w-5xl mx-auto">
          <span className="block mb-2 px-4 sm:px-6 md:px-8">End-to-end development and AI integration for your</span>
          <span className="block flex justify-center px-4 sm:px-6 md:px-8">
            <TypewriterGradient />
          </span>
        </h1>
        <p className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto">
          {siteCopy.home.hero.subheadlineB}
        </p>
        <div className="flex gap-6 justify-center flex-wrap">
          <button
            onClick={() => setShowQuote(true)}
            className={`rounded-full ${gradientMain} text-white font-semibold px-10 py-4 text-xl shadow-lg hover:opacity-90 transition hover:scale-105 backdrop-blur-sm glow-on-hover glow-on-click`}
          >
            {siteCopy.home.hero.ctaPrimary}
          </button>
          <button
            onClick={() => setShowQuote(true)}
            className="glass-button text-white font-semibold px-10 py-4 text-xl hover:bg-white/20 transition hover:scale-105 glow-on-hover glow-on-click"
          >
            {siteCopy.home.hero.ctaSecondary}
          </button>
        </div>
        <div className="mt-6 space-y-2">
          <p className="text-white/60 text-sm">{siteCopy.home.hero.ctaPrimaryMicrocopy}</p>
          <p className="text-white/60 text-sm">{siteCopy.home.hero.ctaSecondaryMicrocopy}</p>
        </div>
      </section>

      {/* Modal for InstantQuoteForm */}
      {showQuote && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
          onClick={(e) => {
            // Only close if clicking the backdrop itself, not its children
            if (e.target === e.currentTarget) {
              setShowQuote(false);
            }
          }}
        >
          <div className="relative w-full max-w-3xl mx-auto">
            <InstantQuoteForm />
            <button
              className="absolute top-2 right-2 text-white/60 hover:text-white text-3xl glow-on-hover z-10"
              onClick={() => setShowQuote(false)}
              aria-label="Close quote form"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Trust Signals */}
      <section className="relative z-10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {siteCopy.home.trustSignals.map((signal, index) => (
              <div key={index} className="glass-card p-4 flex items-center justify-center gap-2 text-white/90 hover:bg-white/10 transition cursor-pointer glow-on-hover glow-on-click">
                <CheckCircleIcon className="h-5 w-5 text-white flex-shrink-0" />
                <span className="text-sm md:text-base">{signal}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Logos Carousel */}
      <section className="relative z-10 bg-dark-blue py-12">
        <CompanyLogosCarousel logos={companyLogos} />
      </section>

      {/* Development Transparency Section */}
      <section className="relative z-10 bg-dark-blue py-20 md:py-40">
        <div className="mx-auto max-w-[95%] md:max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              Complete Development Transparency
            </h2>
            <p className="mt-4 text-xl md:text-2xl text-white/80 max-w-4xl mx-auto">
              Your project, your code, your control - from day one
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 mb-20">
            <div className="flex flex-col items-center">
              <div className="w-full mb-8 md:mb-12 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 hover:transform hover:scale-105 hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.25)] hover:shadow-blue-500/50">
                <img 
                  src="/dashboard_images/code_updates.png" 
                  alt="Code Repository Dashboard" 
                  className="w-full h-[300px] md:h-[400px] object-cover transition-all duration-500"
                />
              </div>
              <div className="text-center max-w-3xl mx-auto px-4">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Real-Time Code Updates</h3>
                <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                  Watch every commit, pull request, and code change as it happens. Full visibility into the development process with detailed commit messages, code reviews, and branch management.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-full mb-8 md:mb-12 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 hover:transform hover:scale-105 hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(168,85,247,0.25)] hover:shadow-purple-500/50">
                <img 
                  src="/dashboard_images/live_app.png" 
                  alt="Live Preview Dashboard" 
                  className="w-full h-[300px] md:h-[400px] object-cover transition-all duration-500"
                />
              </div>
              <div className="text-center max-w-3xl mx-auto px-4">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Live Application Preview</h3>
                <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                  Access a live preview of your application at any time. Test features, review changes, and provide instant feedback. Every deployment is automatically previewed and accessible.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-full mb-8 md:mb-12 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 hover:transform hover:scale-105 hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(236,72,153,0.25)] hover:shadow-pink-500/50">
                <img 
                  src="/dashboard_images/timeline.png" 
                  alt="Project Timeline Dashboard" 
                  className="w-full h-[300px] md:h-[400px] object-cover transition-all duration-500"
                />
              </div>
              <div className="text-center max-w-3xl mx-auto px-4">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Project Timeline & Progress</h3>
                <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                  Track development milestones, sprints, and overall progress in real-time. Stay informed about every aspect of your project's development journey.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg md:text-xl text-white/60 mb-8">
              Every aspect of your project is visible and accessible from day one
            </p>
            <a
              href="/pricing"
              className={`rounded-full ${gradientMain} text-white font-bold px-8 md:px-12 py-4 md:py-6 text-xl md:text-2xl shadow hover:opacity-90 transition transform hover:scale-105 duration-300 inline-block`}
            >
              View Our Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Combined Services & Process Section */}
      <div className="bg-dark-blue py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-8">
              From Idea to Market
            </h2>
            <p className="mt-4 text-2xl text-white/80 max-w-5xl mx-auto leading-relaxed">
              We transform your vision into reality with a streamlined process that gets you to market faster than traditional development
            </p>
            
            {/* Compact Services Overview - Moved here */}
            <div className="mt-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {services.map((service, index) => (
                  <GradientBorder key={service.title} hoverIntensity="high">
                    <div className="p-6 text-center h-full flex flex-col items-center justify-center">
                      <service.icon className="h-10 w-10 text-white mx-auto mb-3" />
                      <h4 className="text-base font-medium text-white/90">{service.title}</h4>
                    </div>
                  </GradientBorder>
                ))}
              </div>
            </div>
          </div>

          {/* How We Work */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
              {siteCopy.home.howWeWork.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {siteCopy.home.howWeWork.steps.map((step, index) => {
                const icons = [RocketLaunchIcon, ClockIcon, ShieldCheckIcon];
                const Icon = icons[index] || RocketLaunchIcon;
                return (
                  <GradientBorder key={index} hoverIntensity="high">
                    <div className="p-8 h-full">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-r from-blue-400 via-fuchsia-400 to-pink-400 p-0.5 glass-strong">
                        <div className="w-full h-full rounded-3xl glass-card flex items-center justify-center">
                          <Icon className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4 text-center">{step.title}</h3>
                      <p className="text-lg text-white/70 leading-relaxed text-center">{step.description}</p>
                    </div>
                  </GradientBorder>
                );
              })}
            </div>
          </div>

          {/* AI Approaches */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
              {siteCopy.home.aiApproaches.title}
            </h2>
            <p className="text-xl text-white/70 mb-12 text-center max-w-3xl mx-auto">
              {siteCopy.home.aiApproaches.subtitle}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GradientBorder hoverIntensity="high">
                <div className="p-8 h-full">
                  <div className="w-16 h-16 rounded-2xl glass-strong flex items-center justify-center mb-6">
                    <ServerIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{siteCopy.home.aiApproaches.openSource.title}</h3>
                  <p className="text-lg text-white/70 mb-6">{siteCopy.home.aiApproaches.openSource.description}</p>
                  <ul className="space-y-3">
                    {siteCopy.home.aiApproaches.openSource.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start text-white/80">
                        <CheckCircleIcon className="h-5 w-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GradientBorder>
              <GradientBorder hoverIntensity="high">
                <div className="p-8 h-full">
                  <div className="w-16 h-16 rounded-2xl glass-strong flex items-center justify-center mb-6">
                    <CloudIcon className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{siteCopy.home.aiApproaches.bedrock.title}</h3>
                  <p className="text-lg text-white/70 mb-6">{siteCopy.home.aiApproaches.bedrock.description}</p>
                  <ul className="space-y-3">
                    {siteCopy.home.aiApproaches.bedrock.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start text-white/80">
                        <CheckCircleIcon className="h-5 w-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GradientBorder>
            </div>
            <p className="text-white/60 text-center mt-8 max-w-3xl mx-auto glass-card p-4">
              {siteCopy.home.aiApproaches.note}
            </p>
          </div>

          {/* Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
            {pricingTiers.map((tier) => (
              <GradientBorder key={tier.name} hoverIntensity="high">
                <div className="p-10 h-full">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-bold text-white">{tier.name}</h3>
                    <CurrencyDollarIcon className="h-12 w-12 text-white" />
                  </div>
                  <p className="text-xl text-white/70 mb-8 leading-relaxed">{tier.description}</p>
                  <ul className="space-y-6 mb-8">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-xl text-white/80">
                        <feature.icon className="h-6 w-6 mr-3 text-white" />
                        {feature.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </GradientBorder>
            ))}
          </div>

          {/* Featured Work */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
              {siteCopy.home.featuredWork.title}
            </h2>
            <p className="text-xl text-white/70 mb-12 text-center">
              {siteCopy.home.featuredWork.subtitle}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {siteCopy.home.featuredWork.items.map((item, index) => (
              <GradientBorder key={index} hoverIntensity="high">
                <div className="p-6 h-full">
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white/70 mb-4 text-sm">{item.description}</p>
                  <p className="text-white font-semibold mb-3 text-sm">{item.outcome}</p>
                  <p className="text-white/60 text-xs">{item.stack}</p>
                </div>
              </GradientBorder>
            ))}
            </div>
          </div>

          {/* FAQ */}
          <FAQAccordion faqItems={siteCopy.home.faq.items} />

          {/* Final CTA */}
          <div className="text-center">
            <div className="glass-card p-12 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {siteCopy.home.finalCta.title}
              </h2>
              <p className="text-xl text-white/70 mb-8">
                {siteCopy.home.finalCta.subtitle}
              </p>
              <div className="flex gap-6 justify-center flex-wrap">
                <button
                  onClick={() => setShowQuote(true)}
                  className={`rounded-full ${gradientMain} text-white font-bold px-12 py-6 text-2xl shadow-lg hover:opacity-90 transition transform hover:scale-105 duration-300 inline-block backdrop-blur-sm glow-on-hover glow-on-click`}
                >
                  {siteCopy.home.finalCta.ctaPrimary}
                </button>
                <button
                  onClick={() => setShowQuote(true)}
                  className="glass-button text-white font-bold px-12 py-6 text-2xl hover:bg-white/20 transition transform hover:scale-105 duration-300 inline-block glow-on-hover glow-on-click"
                >
                  {siteCopy.home.finalCta.ctaSecondary}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-dark-blue py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-6">
              What Our Clients Say
            </h2>
            <p className="mt-4 text-2xl text-white/80 max-w-4xl mx-auto">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>
          <div className="mt-16">
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </div>
      </div>
    </main>
  );
}
