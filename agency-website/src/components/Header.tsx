'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
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
        <Link href="/services" className="hover:text-white">Services</Link>
        <Link href="/about" className="hover:text-white">About</Link>
        <Link href="/contact" className="hover:text-white">Contact</Link>
      </nav>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          type="button"
          className="text-white/80 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          {mobileMenuOpen ? (
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Bars3Icon className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Desktop Login */}
      <div className="hidden md:flex w-[160px] justify-end">
        <Link href="/login" className="text-white/80 hover:text-white text-base md:text-lg">Login</Link>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-dark-blue/95 backdrop-blur-sm md:hidden">
          <div className="px-4 py-3 space-y-3">
            <Link 
              href="/" 
              className="block text-white/80 hover:text-white text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/case-studies" 
              className="block text-white/80 hover:text-white text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              Work
            </Link>
            <Link 
              href="/services" 
              className="block text-white/80 hover:text-white text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/about" 
              className="block text-white/80 hover:text-white text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="block text-white/80 hover:text-white text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href="/login" 
              className="block text-white/80 hover:text-white text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
} 