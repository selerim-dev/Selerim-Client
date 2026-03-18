"use client";

import React from "react";
import SuccessStoriesCarousel from "../../components/SuccessStoriesCarousel";

const stories = [
  {
    name: "Zenfulnote",
    logo: "/success/zenfulnote.png",
    description:
      "Zenfulnote is a full custom product spanning mobile, web, backend infrastructure, and AI-assisted product functionality. Selerim handled the end-to-end build and continues to support the platform as it evolves.",
    highlights: [
      "End-to-end custom build",
      "Mobile, web, and backend delivery",
      "AI-enabled product functionality",
      "Ongoing product support",
      "Enterprise Tier"
    ],
    link: "#",
  },
  {
    name: "CQ Technologies",
    logo: "/success/discoverly.jpg",
    description:
      "CQ Technologies needed a dependable mobile workflow for field operations, reporting, and internal coordination. The result was a custom platform built to support inspection work, report generation, and synchronized operational data.",
    highlights: [
      "Operational workflow tooling",
      "Mobile-first field capture",
      "Custom reporting flow",
      "Internal team enablement",
      "Enterprise Tier"
    ],
    link: "#",
  },
  {
    name: "ViaSync",
    logo: "/success/brightpath.png",
    description:
      "ViaSync was delivered as a lean, startup-friendly mobile application focused on helping users connect and coordinate smoothly. It was shipped quickly on a constrained budget and continues to be supported as the product grows.",
    highlights: [
      "Starter-plan delivery",
      "Lean mobile product build",
      "Fast launch timeline",
      "Ongoing support",
      "Starter Tier"
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
