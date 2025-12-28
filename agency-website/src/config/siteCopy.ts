// Site Map
/*
Home (/)
  - Hero
  - Trust Signals
  - Services Overview
  - AI Approaches
  - How We Work
  - Featured Work
  - FAQ
  - Final CTA

Work / Case Studies (/work or /case-studies)
  - Intro
  - 3 Case Studies
  - What We Deliver
  - CTA

Services (/services)
  - Intro
  - Service Categories
  - Engagement Models
  - CTA

About (/about)
  - Short Story
  - Operating Principles
  - Who We Work Best With / Not a Fit
  - CTA

Contact (/contact)
  - Headline + Subheadline
  - What to Include
  - Response Time
  - CTA Buttons
*/

export const siteCopy = {
  brand: {
    name: 'Selerim',
    tagline: 'Production-ready AI integrations without vendor lock-in'
  },
  
  nav: {
    home: 'Home',
    work: 'Work',
    services: 'Services',
    about: 'About',
    contact: 'Contact'
  },
  
  meta: {
    home: {
      title: 'Selerim | AI-Powered Mobile & Web Development',
      description: 'US-based software agency specializing in production-ready AI integrations. Mobile and web apps with open-source or AWS Bedrock models. No vendor lock-in.'
    },
    work: {
      title: 'Case Studies | Selerim',
      description: 'Real-world examples of production-ready AI integrations and mobile/web applications we\'ve delivered for startups, SMBs, and portfolio companies.'
    },
    services: {
      title: 'Services | Selerim',
      description: 'Mobile and web development with AI integrations. Open-source or AWS Bedrock. Fixed-scope sprints or hourly engagement.'
    },
    about: {
      title: 'About Us | Selerim',
      description: 'US-based software agency focused on production-ready AI features. We work with startups, SMBs, and PE/portfolio companies.'
    },
    contact: {
      title: 'Contact | Selerim',
      description: 'Get in touch to discuss your mobile or web app project with AI integrations. Book a 15-minute intro call or request a project estimate.'
    }
  },
  
  home: {
    hero: {
      headlineA: 'Production-ready AI integrations for mobile and web apps',
      headlineB: 'Ship AI features that work, without vendor lock-in',
      subheadlineA: 'Open-source models or AWS Bedrock. We integrate into existing products or build new. Fixed-scope sprints or hourly.',
      subheadlineB: 'USA-based team and delivery. Technical execution. We build what ships to production.',
      ctaPrimary: 'Book a 15-min intro',
      ctaSecondary: 'Get a project estimate',
      ctaPrimaryMicrocopy: 'Quick call to discuss your needs',
      ctaSecondaryMicrocopy: 'Receive a detailed scope and timeline'
    },
    trustSignals: [
      'US-based team and communication',
      'Production-ready code, not prototypes',
      'No vendor lock-in on AI models',
      'Fixed-scope or hourly engagement',
      'Works with existing products or new builds'
    ],
    servicesOverview: {
      title: 'What We Build',
      services: [
        {
          title: 'Mobile Apps',
          description: 'iOS and Android apps with AI capabilities'
        },
        {
          title: 'Web Applications',
          description: 'Full-stack web apps with AI integrations'
        },
        {
          title: 'AI Integration',
          description: 'Open-source or AWS Bedrock model integration'
        },
        {
          title: 'Existing Product Enhancement',
          description: 'Add AI features to your current application'
        }
      ]
    },
    aiApproaches: {
      title: 'AI Approaches',
      subtitle: 'Choose the model strategy that fits your needs',
      openSource: {
        title: 'Open-Source Models',
        description: 'Self-hosted models you control',
        benefits: [
          'Full data control and privacy',
          'No per-request costs',
          'Customizable and fine-tunable',
          'Works offline or on-premise'
        ]
      },
      bedrock: {
        title: 'AWS Bedrock',
        description: 'Foundation models via AWS',
        benefits: [
          'Access to latest foundation models',
          'Managed infrastructure',
          'Pay-per-use pricing',
          'Enterprise-grade security'
        ]
      },
      note: 'We help you choose based on your requirements, budget, and data privacy needs.'
    },
    howWeWork: {
      title: 'How We Work',
      steps: [
        {
          title: 'Discovery & Scope',
          description: 'We assess your needs and define a clear scope within 24 hours. Fixed-scope sprint or hourly engagement.'
        },
        {
          title: 'Development',
          description: 'Production-ready code with full transparency. Real-time updates, code access, and live previews.'
        },
        {
          title: 'Delivery & Support',
          description: 'Ship to production with documentation. Ongoing support available on hourly or retainer basis.'
        }
      ]
    },
    featuredWork: {
      title: 'Featured Work',
      subtitle: 'Production-ready applications we\'ve shipped',
      items: [
        {
          title: 'AI-Powered Analytics Platform',
          description: 'Web app with custom AI models for predictive analytics',
          outcome: 'Reduced analysis time by 70%',
          stack: 'Next.js, Python, Self-hosted LLM'
        },
        {
          title: 'Mobile App with Bedrock Integration',
          description: 'iOS app using AWS Bedrock for natural language processing',
          outcome: 'Launched in 6 weeks',
          stack: 'React Native, AWS Bedrock, Node.js'
        },
        {
          title: 'E-commerce AI Assistant',
          description: 'Added AI chat to existing e-commerce platform',
          outcome: '30% increase in conversion rate',
          stack: 'Existing stack + Open-source LLM'
        }
      ]
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'Do you build AI products or just prototypes?',
          answer: 'We build production-ready AI features that ship to users. No demos or proof-of-concepts unless that\'s the specific goal.'
        },
        {
          question: 'Open-source vs Bedrock: which should we choose?',
          answer: 'Open-source if you need data privacy, want to avoid per-request costs, or need offline capability. Bedrock if you want access to latest foundation models with managed infrastructure. We help you decide based on your requirements.'
        },
        {
          question: 'Can you integrate into our existing app?',
          answer: 'Yes. We regularly add AI features to existing mobile and web applications. We work with your current stack and deployment process.'
        },
        {
          question: 'How do you handle data privacy and security?',
          answer: 'We follow security best practices and can work with your compliance requirements. Open-source models keep data on your infrastructure. Bedrock uses AWS security controls. We can sign NDAs and security agreements.'
        },
        {
          question: 'What are typical timelines?',
          answer: 'Fixed-scope sprints: 2-6 weeks for MVP features. Full applications: 2-4 months. Hourly engagements vary by scope. We provide timelines in initial assessment.'
        },
        {
          question: 'How do you charge?',
          answer: 'Two models: Fixed-scope sprints with defined deliverables and timeline, or hourly for flexible engagement. We provide estimates for both options.'
        },
        {
          question: 'Do you work with agencies as an overflow partner?',
          answer: 'Yes. We work with agencies and consultancies as a technical delivery partner. We can handle overflow work or specialize in AI integration projects.'
        },
        {
          question: 'What industries do you focus on?',
          answer: 'We work across industries: SaaS, e-commerce, healthcare, fintech, education, and more. Our focus is on technical execution rather than industry specialization.'
        }
      ]
    },
    finalCta: {
      title: 'Ready to build?',
      subtitle: 'Book a 15-minute call or request a project estimate',
      ctaPrimary: 'Book a 15-min intro',
      ctaSecondary: 'Get a project estimate'
    }
  },
  
  work: {
    intro: {
      headline: 'Case Studies',
      subheadline: 'Production-ready applications we\'ve delivered'
    },
    caseStudies: [
      {
        title: 'AI-Powered Analytics Platform',
        problem: 'SaaS company needed predictive analytics but couldn\'t afford per-request API costs at scale.',
        solution: 'Built custom analytics engine using self-hosted open-source LLM. Integrated into existing Next.js web application.',
        outcome: 'Reduced analysis time by 70%. Zero per-request costs. Full data control maintained.',
        stack: 'Next.js, Python, FastAPI, Self-hosted LLM (Llama 2), PostgreSQL'
      },
      {
        title: 'Mobile App with Bedrock Integration',
        problem: 'Startup needed natural language processing in iOS app but lacked ML expertise.',
        solution: 'Developed React Native app with AWS Bedrock integration for chat and content generation features.',
        outcome: 'Launched in 6 weeks. Handles 10K+ daily active users. Managed infrastructure scales automatically.',
        stack: 'React Native, AWS Bedrock (Claude), Node.js, AWS Lambda'
      },
      {
        title: 'E-commerce AI Assistant',
        problem: 'E-commerce platform wanted to add AI shopping assistant without rebuilding entire system.',
        solution: 'Integrated open-source LLM into existing Rails application. Added chat interface and product recommendation engine.',
        outcome: '30% increase in conversion rate. Launched in 4 weeks. No vendor lock-in.',
        stack: 'Ruby on Rails (existing), Python microservice, Self-hosted LLM, Redis'
      }
    ],
    deliverables: {
      title: 'What we deliver',
      items: [
        'Production-ready code with tests',
        'Full repository access from day one',
        'Deployment documentation',
        'API documentation',
        'Live preview environment',
        'Code reviews and transparency',
        'Post-launch support available'
      ]
    },
    cta: {
      title: 'Have a similar project?',
      subtitle: 'Let\'s discuss your requirements',
      button: 'Book a 15-min intro'
    }
  },
  
  services: {
    intro: {
      headline: 'Services',
      subheadline: 'Mobile and web development with production-ready AI integrations'
    },
    categories: [
      {
        title: 'Mobile App Development',
        description: 'iOS and Android applications with AI capabilities',
        deliverables: [
          'Native or cross-platform apps',
          'AI feature integration',
          'App store deployment',
          'Ongoing maintenance'
        ]
      },
      {
        title: 'Web Application Development',
        description: 'Full-stack web applications with AI integrations',
        deliverables: [
          'Frontend and backend development',
          'AI model integration',
          'Deployment and hosting setup',
          'Performance optimization'
        ]
      },
      {
        title: 'AI Integration',
        description: 'Add AI capabilities to existing or new applications',
        deliverables: [
          'Model selection and setup',
          'API development',
          'Integration with your stack',
          'Performance tuning'
        ]
      },
      {
        title: 'Existing Product Enhancement',
        description: 'Add features to your current application',
        deliverables: [
          'Code integration',
          'Feature development',
          'Testing and QA',
          'Deployment support'
        ]
      },
      {
        title: 'Technical Consulting',
        description: 'Architecture and technical guidance',
        deliverables: [
          'System design',
          'Technology selection',
          'Code reviews',
          'Team training'
        ]
      },
      {
        title: 'Maintenance & Support',
        description: 'Ongoing support for deployed applications',
        deliverables: [
          'Bug fixes',
          'Feature updates',
          'Security patches',
          'Performance monitoring'
        ]
      }
    ],
    engagementModels: {
      title: 'Engagement Models',
      hourly: {
        title: 'Hourly',
        description: 'Flexible engagement for evolving requirements',
        bestFor: [
          'Ongoing support',
          'Uncertain scope',
          'Ad-hoc requests',
          'Long-term partnerships'
        ],
        pricing: 'Hourly rate based on project needs'
      },
      sprint: {
        title: 'Fixed-Scope Sprint',
        description: 'Defined deliverables and timeline',
        bestFor: [
          'Clear requirements',
          'Time-bound projects',
          'MVP development',
          'Feature additions'
        ],
        pricing: 'Fixed price for defined scope'
      },
      fixed: {
        title: 'Fixed Scope',
        description: 'Complete project with defined milestones',
        bestFor: [
          'Full applications',
          'Well-defined projects',
          'Budget certainty',
          'Timeline guarantees'
        ],
        pricing: 'Project-based pricing with milestones'
      }
    },
    cta: {
      title: 'Which model fits your project?',
      subtitle: 'We can help you choose the right engagement model',
      button: 'Get a project estimate'
    }
  },
  
  about: {
    story: {
      headline: 'About Selerim',
      content: 'We\'re a US-based software agency specializing in building web and mobile applications, especially with AI integration or using your own AI data. We work with non-technical teams—that\'s our specialty. If you need something built, we\'re your team. We don\'t do pure marketing or design, but we offer in-house design for our full projects. Our approach emphasizes no vendor lock-in, giving clients control over their AI infrastructure. We ship code that works in production, with full transparency and access from day one.'
    },
    principles: {
      title: 'Operating Principles',
      items: [
        'Production-ready code, not prototypes',
        'No vendor lock-in on AI models',
        'Full transparency and code access',
        'US-based communication and delivery',
        'Technical execution over marketing'
      ]
    },
    fit: {
      title: 'Who we work best with',
      items: [
        'Non-technical teams needing web or mobile apps built',
        'Companies wanting AI integration or using their own AI data',
        'Startups and SMBs building AI-powered products',
        'PE/portfolio companies scaling technical capabilities'
      ],
      notFit: {
        title: 'Not a fit for',
        items: [
          'Pure marketing projects without development',
          'Standalone design-only projects',
          'Projects requiring 24/7 on-call support',
          'Companies seeking lowest-cost providers'
        ]
      }
    },
    cta: {
      title: 'Think we\'re a fit?',
      subtitle: 'Let\'s discuss your project',
      button: 'Book a 15-min intro'
    }
  },
  
  contact: {
    headline: 'Get in touch',
    subheadline: 'Book a 15-minute intro call or request a detailed project estimate',
    whatToInclude: {
      title: 'What to include in your message',
      items: [
        'Project type (mobile app, web app, or both)',
        'AI integration needs (if any)',
        'Timeline expectations',
        'Budget range (if comfortable sharing)',
        'Current stage (idea, existing product, etc.)'
      ]
    },
    responseTime: 'We respond within 24 hours',
    ctas: {
      primary: {
        label: 'Book a 15-min intro',
        microcopy: 'Quick call to discuss your needs'
      },
      secondary: {
        label: 'Get a project estimate',
        microcopy: 'Receive a detailed scope and timeline'
      },
      email: {
        label: 'Email us',
        address: 'admin@selerim.com',
        microcopy: 'For detailed inquiries'
      }
    }
  },
  
  ctas: {
    primary: {
      label: 'Book a 15-min intro',
      microcopy: 'Quick call to discuss your needs'
    },
    secondary: {
      label: 'Get a project estimate',
      microcopy: 'Receive a detailed scope and timeline'
    }
  },
  
  legal: {
    disclaimer: 'Selerim is a US-based software development agency. All work is delivered under standard service agreements with defined scope and terms.'
  }
};

