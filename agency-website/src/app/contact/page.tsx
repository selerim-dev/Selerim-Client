'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { submitWebsiteForm } from '../../lib/form-submit';
import { Reveal } from '../../components/motion';
import { CONTAINER, PageHero } from '../../components/site';
import { bookingLinkProps } from '../../lib/links';

const FIELD =
  'block w-full rounded-xl border border-line bg-[var(--surface-2)]/50 px-4 py-3 text-[0.97rem] text-ink placeholder:text-ink-subtle outline-none transition-all duration-300 focus:border-brand focus:ring-2 focus:ring-brand/25';
const LABEL = 'mb-2 block text-sm font-medium text-ink-muted';

const EMPTY = { name: '', email: '', company: '', website: '', message: '', budget: '', timeline: '' };

const INCLUDE = [
  'What you are building or trying to improve',
  'Where AI or automation might help',
  'Your current product, stack, or systems',
  'Timeline and rough budget, if you have one',
];

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await submitWebsiteForm({
        subject: `Selerim inquiry from ${form.name}${form.company ? ` (${form.company})` : ''}`,
        from_name: 'Selerim Website',
        name: form.name,
        email: form.email,
        company: form.company,
        website: form.website,
        message: form.message,
        budget: form.budget,
        timeline: form.timeline,
        source: 'contact-page',
      });
      setSuccess(true);
      setForm(EMPTY);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong sending your message. Please try again, or email us directly.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="What should AI do inside your"
        accent="product or workflow?"
        subtitle="Share what you're building, what's manual, or where your existing software is falling short. We'll help identify a practical path."
      />

      <section className={`${CONTAINER} pb-24 pt-4 md:pb-32`}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left: booking + what to include */}
          <Reveal>
            <div className="flex h-full flex-col gap-4">
              <div className="glass-card p-8 md:p-9">
                <p className="eyebrow mb-3">Prefer to talk?</p>
                <h2 className="text-2xl font-medium tracking-tight text-ink">Book a 15-minute intro</h2>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">
                  A quick, no-pressure call to talk through your product, workflow, and where AI could create leverage.
                </p>
                <Link {...bookingLinkProps} className="btn btn-brand mt-6 h-12 w-full text-base">
                  <CalendarDaysIcon className="h-5 w-5" /> Book a 15-minute intro
                </Link>
              </div>

              <div className="glass-card flex-1 p-8 md:p-9">
                <h3 className="text-lg font-medium tracking-tight text-ink">What to include</h3>
                <ul className="mt-5 space-y-3">
                  {INCLUDE.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[0.95rem] text-ink">
                      <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-relaxed text-ink-muted">
                  Your message lands directly in the Selerim inbox. Expect a fast reply with next steps and scope direction.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal delay={0.1}>
            <div className="glass-card h-full p-8 md:p-10">
              {success ? (
                <div className="flex flex-col items-center justify-center py-16 text-center" role="status">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-brand/40 text-brand">
                    <CheckIcon className="h-7 w-7" />
                  </div>
                  <p className="mt-6 text-xl font-medium text-ink">Thank you for reaching out.</p>
                  <p className="mt-2 max-w-sm text-ink-muted">
                    Your inquiry was submitted successfully. We&apos;ll review it and follow up shortly.
                  </p>
                  <button onClick={() => setSuccess(false)} className="btn btn-ghost mt-8 h-11 px-6 text-sm">
                    Send another message
                  </button>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className={LABEL}>Name</label>
                      <input id="name" name="name" value={form.name} onChange={handleChange} required className={FIELD} placeholder="Your name" autoComplete="name" />
                    </div>
                    <div>
                      <label htmlFor="email" className={LABEL}>Email</label>
                      <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required className={FIELD} placeholder="you@email.com" autoComplete="email" />
                    </div>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label htmlFor="company" className={LABEL}>Company</label>
                      <input id="company" name="company" value={form.company} onChange={handleChange} className={FIELD} placeholder="Company or brand" autoComplete="organization" />
                    </div>
                    <div>
                      <label htmlFor="website" className={LABEL}>Website / product URL</label>
                      <input id="website" name="website" value={form.website} onChange={handleChange} className={FIELD} placeholder="https://" inputMode="url" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className={LABEL}>What are you trying to build or improve?</label>
                    <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} required className={FIELD} placeholder="The product or workflow, what's manual today, any AI ideas, and what success looks like." />
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label htmlFor="budget" className={LABEL}>Budget range <span className="text-ink-subtle">(optional)</span></label>
                      <input id="budget" name="budget" value={form.budget} onChange={handleChange} className={FIELD} placeholder="No pressure if unsure" />
                    </div>
                    <div>
                      <label htmlFor="timeline" className={LABEL}>Timeline <span className="text-ink-subtle">(optional)</span></label>
                      <input id="timeline" name="timeline" value={form.timeline} onChange={handleChange} className={FIELD} placeholder="e.g. next quarter" />
                    </div>
                  </div>

                  {error && (
                    <p role="alert" className="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-ink">
                      {error}
                    </p>
                  )}

                  <button type="submit" disabled={isLoading} className="btn btn-brand h-12 w-full text-base disabled:opacity-60">
                    {isLoading ? 'Sending…' : 'Send inquiry'}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
