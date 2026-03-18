'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/case-studies', label: 'Work' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:px-6 md:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/12 bg-slate-950/72 px-4 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
      <div className="flex items-center gap-2 md:gap-3 w-[120px] md:w-[170px]">
        <Link href="/">
          <Image 
            src="/logo.png" 
            alt="Selerim Logo" 
            width={36} 
            height={36} 
            className="w-8 h-8 md:w-10 md:h-10"
            priority 
          />
        </Link>
        <Link href="/" className="text-lg md:text-2xl font-bold text-white tracking-wide">selerim</Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 text-sm md:text-base absolute left-1/2 transform -translate-x-1/2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="text-white/72 transition hover:text-white">
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          type="button"
          className="text-white/80 hover:text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          {mobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Desktop Login */}
      <div className="hidden md:flex w-[170px] justify-end">
        <Link href="/contact" className="glass-button px-4 py-2 text-sm font-medium text-white">
          Start a Project
        </Link>
      </div>
      </div>
    </header>

    {/* Mobile menu - full screen overlay (outside header) */}
    {mobileMenuOpen && (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black z-[60] md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Full screen menu */}
        <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-dark-blue z-[70] md:hidden">
          <div className="flex flex-col h-full w-full">
            {/* Menu header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <span className="text-2xl font-bold text-white">Menu</span>
              <button
                type="button"
                className="text-white hover:text-white p-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-7 w-7" aria-hidden="true" />
              </button>
            </div>

            {/* Menu items */}
            <nav className="flex-1 px-6 py-8 space-y-3 overflow-y-auto">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="block glass-card px-5 py-4 rounded-xl text-white text-xl font-medium hover:bg-white/10 transition glow-on-hover"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </>
    )}
    </>
  );
} 
