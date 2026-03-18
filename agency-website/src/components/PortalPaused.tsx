'use client';

import Link from 'next/link';
import { gradientMain } from '../config/tokens';
import { ADMIN_EMAIL } from '../lib/leads';

type PortalPausedProps = {
  title?: string;
  description?: string;
  compact?: boolean;
};

export default function PortalPaused({
  title = 'Private Portal Paused',
  description = 'Selerim is currently running as a marketing-first site while the old client portal is being retired from the public experience.',
  compact = false,
}: PortalPausedProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-dark-blue px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="bg-gradient-fullscreen">
        <div className="absolute left-[-12%] top-[-10%] h-[42vh] w-[42vh] rounded-full bg-cyan-300/14 blur-[180px]" />
        <div className="absolute right-[-8%] top-[18%] h-[40vh] w-[40vh] rounded-full bg-blue-400/14 blur-[180px]" />
        <div className="absolute bottom-[-12%] left-[18%] h-[38vh] w-[38vh] rounded-full bg-white/10 blur-[180px]" />
      </div>

      <div className={`relative z-10 mx-auto ${compact ? 'max-w-4xl' : 'max-w-3xl'} pt-16`}>
        <div className="glass-card border border-white/15 bg-white/[0.08] p-8 sm:p-12">
          <div className="mb-6 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.24em] text-white/65">
            Selerim Private Access
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">
            {description}
          </p>
          <div className="mt-8 grid gap-4 rounded-[28px] border border-white/12 bg-black/20 p-5 text-sm text-white/65 sm:grid-cols-3">
            <div>
              <div className="mb-1 text-white/90">Status</div>
              <div>Portal UI hidden from the public site</div>
            </div>
            <div>
              <div className="mb-1 text-white/90">Current path</div>
              <div>Marketing, contact, and quote capture only</div>
            </div>
            <div>
              <div className="mb-1 text-white/90">Contact</div>
              <a className="text-cyan-200 hover:text-white" href={`mailto:${ADMIN_EMAIL}`}>{ADMIN_EMAIL}</a>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className={`rounded-full ${gradientMain} px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:opacity-90`}
            >
              Start a Project
            </Link>
            <Link
              href="/"
              className="glass-button px-6 py-3 text-base font-semibold text-white"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
