'use client';

import React, { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { siteCopy } from '../../config/siteCopy';
import { submitWebsiteForm } from '../../lib/form-submit';
import Scene from '../../components/Scene';
import { Reveal } from '../../components/motion';
import { CONTAINER, PageHero } from '../../components/site';

const FIELD =
  'block w-full rounded-xl border border-line bg-[var(--surface-2)]/50 px-4 py-3 text-[0.97rem] text-ink placeholder:text-ink-subtle outline-none transition-all duration-300 focus:border-brand focus:ring-2 focus:ring-brand/25';
const LABEL = 'mb-2 block text-sm font-medium text-ink-muted';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', budget: '', subject: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await submitWebsiteForm({
        subject: `Selerim website inquiry: ${form.subject}`,
        from_name: 'Selerim Website',
        name: form.name,
        email: form.email,
        company: form.company,
        phone: form.phone,
        budget: form.budget,
        inquiry_subject: form.subject,
        message: form.message,
        source: 'contact-page',
      });
      setSuccess(true);
      setForm({ name: '', email: '', company: '', phone: '', budget: '', subject: '', message: '' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Scene tone="dark">
        <PageHero eyebrow="Contact" title="Get in" accent="touch." subtitle={siteCopy.contact.subheadline} />
      </Scene>

      <Scene tone="light">
        <div className={`${CONTAINER} pb-24 pt-4 md:pb-32`}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            {/* What to include */}
            <Reveal>
              <div className="glass-card h-full p-8 md:p-10">
                <h2 className="text-2xl font-medium tracking-tight text-ink">{siteCopy.contact.whatToInclude.title}</h2>
                <ul className="mt-6 space-y-3">
                  {siteCopy.contact.whatToInclude.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[0.95rem] text-ink">
                      <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 rounded-2xl border border-line bg-[var(--surface-2)]/40 p-5">
                  <p className="eyebrow">What happens next</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    Share your project details and they land directly in the Selerim inbox. Expect a fast reply with next
                    steps, scope direction, and timeline guidance.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal delay={0.1}>
              <div className="glass-card h-full p-8 md:p-10">
                {success ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-brand/40 text-brand">
                      <CheckIcon className="h-7 w-7" />
                    </div>
                    <p className="mt-6 text-xl font-medium text-ink">Thank you for reaching out!</p>
                    <p className="mt-2 max-w-sm text-ink-muted">
                      Your inquiry was submitted successfully. We&apos;ll review it and follow up shortly.
                    </p>
                    <button onClick={() => setSuccess(false)} className="btn btn-ghost mt-8 h-11 px-6 text-sm">
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="name" className={LABEL}>Name</label>
                      <input id="name" name="name" value={form.name} onChange={handleChange} required className={FIELD} placeholder="Your name" />
                    </div>
                    <div>
                      <label htmlFor="email" className={LABEL}>Email</label>
                      <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required className={FIELD} placeholder="you@email.com" />
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label htmlFor="company" className={LABEL}>Company</label>
                        <input id="company" name="company" value={form.company} onChange={handleChange} className={FIELD} placeholder="Company or brand" />
                      </div>
                      <div>
                        <label htmlFor="phone" className={LABEL}>Phone</label>
                        <input id="phone" name="phone" value={form.phone} onChange={handleChange} className={FIELD} placeholder="Optional" />
                      </div>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label htmlFor="subject" className={LABEL}>Subject</label>
                        <input id="subject" name="subject" value={form.subject} onChange={handleChange} required className={FIELD} placeholder="Subject" />
                      </div>
                      <div>
                        <label htmlFor="budget" className={LABEL}>Budget range</label>
                        <input id="budget" name="budget" value={form.budget} onChange={handleChange} className={FIELD} placeholder="e.g. $15k–$30k" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="message" className={LABEL}>Message</label>
                      <textarea id="message" name="message" rows={6} value={form.message} onChange={handleChange} required className={FIELD} placeholder="How can we help you?" />
                    </div>
                    <button type="submit" disabled={isLoading} className="btn btn-brand h-12 w-full text-base disabled:opacity-60">
                      {isLoading ? 'Sending…' : 'Send message'}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </Scene>
    </>
  );
}
