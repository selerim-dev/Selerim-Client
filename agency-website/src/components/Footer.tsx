import React from 'react';
import Link from 'next/link';
import { siteCopy } from '../config/siteCopy';
import { ADMIN_EMAIL } from '../lib/leads';

export default function Footer() {
  return (
    <footer className="relative mt-16 border-t border-white/10 bg-dark-blue pb-6 pt-8 text-white">
      {/* Fade/gradient at the top for smooth transition */}
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-t from-dark-blue/90 to-transparent pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="glass-card mb-5 flex flex-col items-center justify-between gap-5 p-5 sm:p-6 md:flex-row md:gap-10">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="mb-1 text-2xl font-bold text-white transition hover:text-blue-300">{siteCopy.brand.name}</Link>
            <p className="text-center text-sm text-white/70 md:text-left">{siteCopy.brand.tagline}</p>
            <span className="mt-2 text-sm text-white/60">&copy; {new Date().getFullYear()} {siteCopy.brand.name}. All rights reserved.</span>
          </div>
          <nav className="flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium md:gap-x-8 md:text-base">
            <Link href="/contact" className="text-white/80 hover:text-white transition relative hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">Contact</Link>
            <Link href="/case-studies" className="text-white/80 hover:text-white transition relative hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">Work</Link>
            <Link href="/services" className="text-white/80 hover:text-white transition relative hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">Services</Link>
            <Link href="/pricing" className="text-white/80 hover:text-white transition relative hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">Pricing</Link>
            <Link href="/about" className="text-white/80 hover:text-white transition relative hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">About</Link>
            <Link href="/terms" className="text-white/80 hover:text-white transition relative hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">Terms</Link>
            <Link href="/privacy" className="text-white/80 hover:text-white transition relative hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">Privacy</Link>
          </nav>
          <a href={`mailto:${ADMIN_EMAIL}`} className="text-sm text-cyan-200 transition hover:text-white">{ADMIN_EMAIL}</a>
        </div>
        {/* Legal Disclaimer */}
        <div className="border-t border-white/10 pt-4 text-center">
          <p className="text-sm text-white/60">{siteCopy.legal.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
} 
