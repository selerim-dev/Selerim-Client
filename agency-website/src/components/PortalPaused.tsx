'use client';

import Link from 'next/link';
import { ADMIN_EMAIL } from '../lib/leads';

type PortalPausedProps = {
  title?: string;
  description?: string;
  compact?: boolean;
};

export default function PortalPaused({
  title = 'Private portal paused',
  description = 'Selerim is currently running as a marketing-first site while the old client portal is being retired from the public experience.',
}: PortalPausedProps) {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center px-5 py-32 sm:px-7">
      <div className="mx-auto w-full max-w-2xl">
        <div className="glass-strong overflow-hidden rounded-[2rem] p-8 sm:p-12">
          <p className="eyebrow mb-7">Selerim private access</p>
          <h1 className="display text-4xl text-ink-strong sm:text-5xl">
            {title.replace(/\.$/, '')}
            <span className="accent text-gradient">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">{description}</p>

          <div className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-line text-sm sm:grid-cols-3">
            {[
              { k: 'Status', v: 'Portal hidden from the public site' },
              { k: 'Current path', v: 'Marketing, contact & quote capture' },
              { k: 'Contact', v: <a className="link-underline text-ink" href={`mailto:${ADMIN_EMAIL}`}>{ADMIN_EMAIL}</a> },
            ].map((row) => (
              <div key={row.k} className="bg-[var(--surface-2)]/40 p-5">
                <div className="eyebrow mb-2 text-[0.6rem]">{row.k}</div>
                <div className="text-ink-muted">{row.v}</div>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-brand h-12 px-7 text-base">
              Start a project
            </Link>
            <Link href="/" className="btn btn-ghost h-12 px-7 text-base">
              Return home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
