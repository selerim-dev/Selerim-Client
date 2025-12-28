'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 md:px-12 py-2 md:py-3 bg-dark-blue/95 backdrop-blur-sm">
      <div className="flex items-center gap-2 md:gap-3 w-[100px] md:w-[160px]">
        <Link href="/">
          <Image 
            src="/Logo.png" 
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
      <nav className="hidden md:flex gap-6 text-white/80 text-base md:text-lg absolute left-1/2 transform -translate-x-1/2">
        <Link href="/" className="hover:text-white">Home</Link>
        <Link href="/case-studies" className="hover:text-white">Work</Link>
        <Link href="/pricing" className="hover:text-white">Pricing</Link>
        <Link href="/about" className="hover:text-white">About</Link>
        <Link href="/contact" className="hover:text-white">Contact</Link>
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
      <div className="hidden md:flex w-[160px] justify-end">
        <Link href="/login" className="text-white/80 hover:text-white text-base md:text-lg">Login</Link>
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
              <Link 
                href="/" 
                className="block glass-card px-5 py-4 rounded-xl text-white text-xl font-medium hover:bg-white/10 transition glow-on-hover"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/case-studies" 
                className="block glass-card px-5 py-4 rounded-xl text-white text-xl font-medium hover:bg-white/10 transition glow-on-hover"
                onClick={() => setMobileMenuOpen(false)}
              >
                Work
              </Link>
              <Link 
                href="/pricing" 
                className="block glass-card px-5 py-4 rounded-xl text-white text-xl font-medium hover:bg-white/10 transition glow-on-hover"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                href="/about" 
                className="block glass-card px-5 py-4 rounded-xl text-white text-xl font-medium hover:bg-white/10 transition glow-on-hover"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="block glass-card px-5 py-4 rounded-xl text-white text-xl font-medium hover:bg-white/10 transition glow-on-hover"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-6 border-t border-white/10 mt-6">
                <Link 
                  href="/login" 
                  className="block glass-card px-5 py-4 rounded-xl text-white text-xl font-medium hover:bg-white/10 transition glow-on-hover"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </>
    )}
    </>
  );
} 