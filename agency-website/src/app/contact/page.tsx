"use client";

import React, { useState } from "react";
import { gradientMain } from "../../config/tokens";
import { siteCopy } from "../../config/siteCopy";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { submitWebsiteForm } from "../../lib/form-submit";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    budget: "",
    subject: "",
    message: "",
  });
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
      setForm({ name: "", email: "", company: "", phone: "", budget: "", subject: "", message: "" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-dark-blue overflow-x-hidden">
      {/* Full screen background gradients */}
      <div className="bg-gradient-fullscreen">
        <div className="absolute left-[-10%] top-[-10%] h-[50vh] w-[50vh] rounded-full bg-blue-400/20 blur-[200px]" />
        <div className="absolute right-[-10%] top-[20%] h-[45vh] w-[45vh] rounded-full bg-purple-400/15 blur-[200px]" />
        <div className="absolute left-[20%] bottom-[-10%] h-[50vh] w-[50vh] rounded-full bg-pink-400/15 blur-[200px]" />
      </div>
      {/* Hero Section */}
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {siteCopy.contact.headline}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-white/80">
              {siteCopy.contact.subheadline}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl mx-auto">

            <div className="grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
              {/* What to Include */}
              <div className="glass-card p-8">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                  {siteCopy.contact.whatToInclude.title}
                </h2>
            <ul className="space-y-3">
              {siteCopy.contact.whatToInclude.items.map((item, index) => (
                <li key={index} className="flex items-start text-white/80">
                  <CheckCircleIcon className="h-5 w-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
                </ul>
                <p className="mt-6 text-white/60 text-sm">
                  {siteCopy.contact.responseTime}
                </p>
                <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-white/45">What Happens Next</p>
                  <p className="mt-3 text-sm leading-6 text-white/60">
                    Share the project details here and the submission will land directly in the Selerim inbox for review. Expect a fast reply with next steps, scope direction, and timeline guidance.
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="glass-card p-8">
            {success ? (
              <div className="text-center py-12">
                <div className="text-3xl mb-4">✓</div>
                <p className="text-xl text-white/90 mb-2 font-semibold">Thank you for reaching out!</p>
                <p className="text-lg text-white/70">Your inquiry has been submitted successfully. We&apos;ll review it and follow up shortly.</p>
                <button
                  className={`mt-8 rounded-full ${gradientMain} px-8 py-3 text-lg font-semibold text-white shadow hover:opacity-90 transition glow-on-hover glow-on-click`}
                  onClick={() => setSuccess(false)}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-lg font-medium text-white/80 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border-0 bg-white/5 px-5 py-4 text-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-lg font-medium text-white/80 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border-0 bg-white/5 px-5 py-4 text-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400"
                    placeholder="you@email.com"
                  />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="company" className="block text-lg font-medium text-white/80 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-0 bg-white/5 px-5 py-4 text-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400"
                    placeholder="Company or brand"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-lg font-medium text-white/80 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-0 bg-white/5 px-5 py-4 text-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400"
                    placeholder="Optional"
                  />
                </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-lg font-medium text-white/80 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border-0 bg-white/5 px-5 py-4 text-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400"
                    placeholder="Subject"
                  />
                </div>
                <div>
                  <label htmlFor="budget" className="block text-lg font-medium text-white/80 mb-2">
                    Budget Range
                  </label>
                  <input
                    type="text"
                    id="budget"
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-0 bg-white/5 px-5 py-4 text-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400"
                    placeholder="Example: $15k-$30k"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-lg font-medium text-white/80 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border-0 bg-white/5 px-5 py-4 text-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400"
                    placeholder="How can we help you?"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full rounded-full ${gradientMain} px-8 py-4 text-xl font-semibold text-white shadow hover:opacity-90 transition glow-on-hover glow-on-click`}
                  >
                    {isLoading ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
