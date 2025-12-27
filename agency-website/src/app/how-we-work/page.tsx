import React from 'react';
import { 
  LightBulbIcon, 
  DocumentTextIcon, 
  CodeBracketIcon, 
  RocketLaunchIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const processSteps = [
  {
    icon: LightBulbIcon,
    title: 'Discovery & Research',
    description: 'We begin by understanding your business goals, target audience, and market position. This phase includes competitor analysis, user research, and defining project objectives.',
    details: [
      'Initial consultation and requirements gathering',
      'Market and competitor analysis',
      'User research and persona development',
      'Project scope and timeline definition',
    ],
  },
  {
    icon: DocumentTextIcon,
    title: 'Strategy & Planning',
    description: 'Based on our research, we develop a comprehensive strategy that aligns with your business objectives. This includes defining the technical approach, architecture, and project roadmap.',
    details: [
      'Technical architecture planning',
      'Feature prioritization and roadmap',
      'Resource allocation and team formation',
      'Risk assessment and mitigation planning',
    ],
  },
  {
    icon: CodeBracketIcon,
    title: 'Design & Development',
    description: 'Our team of designers and developers work together to create a solution that is both beautiful and functional. We follow agile methodologies and maintain regular communication.',
    details: [
      'UI/UX design and prototyping',
      'Agile development sprints',
      'Regular progress updates and demos',
      'Quality assurance and testing',
    ],
  },
  {
    icon: RocketLaunchIcon,
    title: 'Launch & Deployment',
    description: 'We ensure a smooth launch by thoroughly testing the solution and preparing for deployment. Our team handles the technical aspects while you focus on your business.',
    details: [
      'Final testing and quality assurance',
      'Performance optimization',
      'Deployment and launch support',
      'Post-launch monitoring and support',
    ],
  },
  {
    icon: UserGroupIcon,
    title: 'Training & Support',
    description: 'We provide comprehensive training and ongoing support to ensure your team can effectively use and maintain the solution. Our support team is always available to help.',
    details: [
      'User training and documentation',
      'Technical support and maintenance',
      'Regular updates and improvements',
      'Performance monitoring and optimization',
    ],
  },
  {
    icon: ChartBarIcon,
    title: 'Growth & Optimization',
    description: 'We continuously monitor and optimize the solution to ensure it meets your evolving business needs. Our analytics and reporting tools help you make data-driven decisions.',
    details: [
      'Performance analytics and reporting',
      'User feedback collection and analysis',
      'Continuous improvement and optimization',
      'Strategic growth planning',
    ],
  },
];

export default function HowWeWork() {
  return (
    <main>
      {/* Hero Section */}
      <div className="bg-dark-blue">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              How We Work
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
              Our proven methodology for delivering exceptional results
            </p>
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="bg-dark-blue py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            {processSteps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="flex items-center gap-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <step.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    {step.title}
                  </h2>
                </div>
                <p className="mt-2 text-base text-white/80">
                  {step.description}
                </p>
                <ul className="mt-6 space-y-4">
                  {step.details.map((detail) => (
                    <li key={detail} className="flex items-start">
                      <span className="flex h-6 items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      </span>
                      <span className="ml-3 text-white/80">{detail}</span>
                    </li>
                  ))}
                </ul>
                {index < processSteps.length - 1 && (
                  <div className="absolute -bottom-8 left-6 h-8 w-0.5 bg-white/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-dark-blue py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              Let's discuss how we can help transform your business
            </p>
            <div className="mt-8">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-black hover:bg-white/90"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 