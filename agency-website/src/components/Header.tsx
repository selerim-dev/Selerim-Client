'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import ThemeToggle from './ThemeToggle';

const NAV = [
  { href: '/case-studies', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'Studio' },
  { href: '/contact', label: 'Contact' },
];

function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="group flex items-center gap-2.5"
      aria-label="Selerim home"
    >
      <Image
        src="/logo.png"
        alt=""
        width={30}
        height={30}
        priority
        className="brand-mark h-7 w-7 object-contain transition-transform duration-500 group-hover:rotate-[40deg]"
      />
      <span className="flex items-baseline gap-1.5 leading-none">
        <span className="text-[1.35rem] font-medium tracking-[-0.04em] text-ink">selerim</span>
        <span className="accent text-base text-ink-subtle">studio</span>
      </span>
    </Link>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`absolute inset-0 -z-10 border-b transition-all duration-500 ${
            scrolled
              ? 'border-line bg-[var(--surface)]/55 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_12px_40px_-24px_var(--glass-shadow)]'
              : 'border-transparent bg-[var(--surface)]/15 backdrop-blur-md backdrop-saturate-150'
          }`}
        />
        <nav className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-5 sm:px-7 lg:px-10">
          <Wordmark />

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-full px-3.5 py-2 text-[0.92rem] transition-colors duration-300 ${
                    active ? 'text-ink' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-ink"
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-flex">
              <ThemeToggle />
            </span>
            <span className="hidden md:inline-flex">
              <Link href="/contact" className="btn btn-primary h-9 px-5 text-[0.9rem]">
                Start a project
              </Link>
            </span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-line-strong md:hidden"
              aria-label="Open menu"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-[var(--surface)]/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex h-full flex-col">
              <div className="flex h-[72px] items-center justify-between px-5 sm:px-7">
                <Wordmark onClick={() => setOpen(false)} />
                <div className="flex items-center gap-2.5">
                  <ThemeToggle />
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink"
                    aria-label="Close menu"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <motion.nav
                className="flex flex-1 flex-col justify-center gap-1 px-6 pb-20"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } }}
              >
                {NAV.map((item) => (
                  <motion.div
                    key={item.href}
                    variants={{
                      hidden: { opacity: 0, y: 22 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-3 border-b border-line py-5 text-4xl font-medium tracking-tight text-ink"
                    >
                      <span className="text-sm text-ink-subtle">0{NAV.indexOf(item) + 1}</span>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  className="pt-8"
                  variants={{
                    hidden: { opacity: 0, y: 22 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="btn btn-brand h-14 w-full text-lg"
                  >
                    Start a project
                  </Link>
                </motion.div>
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
