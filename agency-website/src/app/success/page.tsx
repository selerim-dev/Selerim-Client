"use client";

import React from "react";
import SuccessStoriesCarousel from "../../components/SuccessStoriesCarousel";

const stories = [
  {
    name: "Zenfulnote",
    logo: "/success/zenfulnote.png",
    description:
      "Zenfulnote is a mobile app built for both iOS and Android, helping users capture thoughts and stay organized. We built Zenfulnote from scratch in just 3 months, delivering a seamless experience on both platforms. The app now serves over 150,000 users and boasts 99.9% uptime, thanks to robust cloud infrastructure and continuous monitoring.",
    highlights: [
      "150,000+ users",
      "99.9% uptime",
      "Built in 3 months",
      "Perfected for Apple & Android",
      "Enterprise Tier"
    ],
    link: "#",
  },
  {
    name: "Discoverly.ai",
    logo: "/success/discoverly.jpg",
    description:
      "Discoverly.ai is a software affiliate platform that accurately tracks commissions from software app links. The platform handles tens of thousands of dollars in volume every month, with 99.9% uptime and real-time analytics for partners. Our team engineered a scalable, secure backend to ensure every click and commission is tracked flawlessly.",
    highlights: [
      "Tens of thousands in monthly volume",
      "Accurate commission tracking",
      "99.9% uptime",
      "Real-time analytics",
      "Enterprise Tier"
    ],
    link: "#",
  },
  {
    name: "BrightPath LMS",
    logo: "/success/brightpath.png",
    description:
      "BrightPath LMS is a learning management system for schools and businesses. We delivered a custom solution with advanced reporting, integrations, and a beautiful UI. The platform now supports over 50 organizations and thousands of learners.",
    highlights: [
      "Custom integrations",
      "Advanced reporting",
      "Thousands of learners",
      "Modern UI",
      "Starter Tier"
    ],
    link: "#",
  },
  {
    name: "DoorSpace Portal",
    logo: "/success/doorspace.jpeg",
    description:
      "DoorSpace Portal is a secure client portal for real estate professionals. We built a robust, easy-to-use platform that streamlines document sharing and client communication, with bank-level security and 24/7 uptime.",
    highlights: [
      "Bank-level security",
      "24/7 uptime",
      "Streamlined communication",
      "Trusted by real estate pros",
      "Growth Tier"
    ],
    link: "#",
  },
];

export default function SuccessStoriesPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-dark-blue">
      {/* Background gradients - ensure they cover the full height */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden min-h-full">
        <div className="absolute left-[-12vw] top-[-12vw] h-[35vw] w-[35vw] rounded-full bg-blue-400/15 blur-[150px]" />
        <div className="absolute right-[-12vw] top-[25vw] h-[30vw] w-[30vw] rounded-full bg-gray-400/15 blur-[150px]" />
        <div className="absolute left-[15vw] bottom-[-12vw] h-[30vw] w-[30vw] rounded-full bg-blue-400/15 blur-[150px]" />
      </div>
      <div className="relative z-10 flex-1 w-full max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8 flex flex-col">
        <h1 className="text-5xl font-bold text-white mb-16 text-center drop-shadow-lg">Success Stories</h1>
        <SuccessStoriesCarousel stories={stories} />
      </div>
    </div>
  );
} 