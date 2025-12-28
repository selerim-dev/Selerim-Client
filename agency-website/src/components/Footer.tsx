import React from 'react';
import Link from 'next/link';
import { siteCopy } from '../config/siteCopy';

export default function Footer() {
  return (
    <footer className="relative bg-dark-blue border-t border-white/10 text-white pt-10 pb-8 mt-16">
      {/* Fade/gradient at the top for smooth transition */}
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-t from-dark-blue/90 to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 mb-6">
          {/* Left: Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="text-2xl font-bold mb-2 text-white hover:text-blue-300 transition">{siteCopy.brand.name}</Link>
            <span className="text-sm text-white/60">&copy; {new Date().getFullYear()} {siteCopy.brand.name}. All rights reserved.</span>
          </div>
          {/* Center: Navigation */}
          <nav className="flex flex-col md:flex-row items-center gap-4 md:gap-10 text-base font-medium">
            <Link href="/contact" className="text-white/80 hover:text-white transition relative hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">Contact</Link>
            <Link href="/case-studies" className="text-white/80 hover:text-white transition relative hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">Work</Link>
            <Link href="/pricing" className="text-white/80 hover:text-white transition relative hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">Pricing</Link>
            <Link href="/about" className="text-white/80 hover:text-white transition relative hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">About</Link>
            <Link href="/terms" className="text-white/80 hover:text-white transition relative hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">Terms</Link>
            <Link href="/privacy" className="text-white/80 hover:text-white transition relative hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">Privacy</Link>
          </nav>
        </div>
        {/* Legal Disclaimer */}
        <div className="text-center border-t border-white/10 pt-6">
          <p className="text-sm text-white/60">{siteCopy.legal.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
} 