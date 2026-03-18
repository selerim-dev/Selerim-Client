'use client';

import React, { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNotification } from './NotificationProvider';
import { estimateProject, formatCurrency } from '../lib/quote-estimator';
import { submitWebsiteForm } from '../lib/form-submit';

const MAIN_COMPONENTS = [
  'Auth', 'Login', 'Location', 'Push Notifications', 'Payments', 'Chat', 'Profile', 'Feed', 'Search', 'Settings', 'Analytics', 'Admin Panel', 'File Upload', 'Calendar', 'Notifications',
];

const BUDGETS = [
  'Unknown', 'Under $10k', '$10k-$25k', '$25k-$50k', '$50k-$100k', '$100k+',
];

const TIMELINES = [
  'Unknown', '1-2 weeks', '2-4 weeks', '1-2 months', '2-4 months', '4+ months',
];

type ComponentPillsProps = {
  selected: string[];
  onSelect: (comp: string) => void;
  onRemove: (comp: string) => void;
  onAdd: (comp: string) => void;
};

function ComponentPills({ selected, onSelect, onRemove, onAdd }: ComponentPillsProps) {
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState('');

  return (
    <div className="flex flex-wrap gap-2">
      {selected.map((comp) => (
        <span key={comp} className="flex items-center glass-card px-3 py-1 rounded-full text-sm text-white">
          {comp}
          <button
            type="button"
            className="ml-1 hover:text-pink-400"
            onClick={() => onRemove(comp)}
            aria-label={`Remove ${comp}`}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </span>
      ))}
      {MAIN_COMPONENTS.filter(c => !selected.includes(c)).slice(0, 15).map((comp) => (
        <button
          key={comp}
          type="button"
          className="glass-button text-white/80 px-3 py-1 rounded-full text-sm hover:bg-white/20 transition glow-on-hover"
          onClick={() => onSelect(comp)}
        >
          {comp}
        </button>
      ))}
      {adding ? (
        <div className="flex items-center">
          <input
            autoFocus
            className="glass-card text-white px-2 py-1 rounded-l-full text-sm outline-none border-none"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (input.trim()) {
                  onAdd(input.trim());
                  setInput('');
                  setAdding(false);
                }
              }
            }}
            placeholder="Add component"
          />
          <button
            type="button"
            onClick={() => {
              if (input.trim()) {
                onAdd(input.trim());
                setInput('');
                setAdding(false);
              }
            }}
            className="glass-button px-2 py-1 rounded-r-full text-white text-sm glow-on-hover"
          >
            Add
          </button>
          <button type="button" className="ml-1 text-white/60" onClick={() => { setAdding(false); setInput(''); }}>
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="flex items-center glass-button text-white px-2 py-1 rounded-full text-sm hover:bg-white/20 transition glow-on-hover"
          onClick={() => setAdding(true)}
        >
          <PlusIcon className="h-4 w-4 mr-1" /> Add
        </button>
      )}
    </div>
  );
}

type QuoteResult = {
  priceLabel: string;
  rangeLabel: string;
  hoursLabel: string;
  recommendation: string;
  assumptions: string[];
};
type QuoteResultModalProps = { result: QuoteResult; onClose: () => void; onGetQuote: () => void };

function QuoteResultModal({ result, onClose, onGetQuote }: QuoteResultModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 md:p-8">
      <div className="glass-card p-6 sm:p-8 md:p-12 max-w-3xl w-full text-center shadow-2xl relative mx-4">
        <button className="absolute top-4 right-4 text-white/60 hover:text-white text-3xl glow-on-hover z-10" onClick={onClose} aria-label="Close offer modal">×</button>
        <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">Your Instant Quote</h3>
        <div className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent mb-3 sm:mb-4">
          {result.priceLabel}
        </div>
        <div className="mb-2 text-lg text-white/75">{result.rangeLabel}</div>
        <div className="mb-4 text-sm uppercase tracking-[0.22em] text-white/45">{result.hoursLabel}</div>
        <div className="text-lg sm:text-xl text-white/80 mb-4 sm:mb-6">
          {result.recommendation}
        </div>
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {result.assumptions.map((assumption) => (
            <span key={assumption} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-white/65">
              {assumption}
            </span>
          ))}
        </div>
        <div className="text-sm sm:text-base text-white/60 mb-6 sm:mb-8">
          This quote is an estimate. We recommend a 1:1 call to review your needs. Final pricing may change after a detailed review.
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onGetQuote}
            className="rounded-full bg-gradient-to-r from-blue-400 via-fuchsia-400 to-pink-400 text-white font-semibold px-8 py-3 text-lg hover:opacity-90 transition glow-on-hover glow-on-click"
          >
            Get Detailed Quote
          </button>
          <a 
            href="/contact"
            className="glass-button text-white font-semibold px-8 py-3 text-lg hover:bg-white/20 transition glow-on-hover glow-on-click"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}

const InstantQuoteForm: React.FC = () => {
  const { notify } = useNotification();
  const [step, setStep] = useState<'budget' | 'form'>('budget');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [components, setComponents] = useState<string[]>([]);
  const [brief, setBrief] = useState('');
  const [reliability, setReliability] = useState<'standard' | 'elevated' | 'critical'>('elevated');
  const [scale, setScale] = useState<'internal' | 'startup' | 'growth' | 'scale'>('startup');
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | QuoteResult>(null);

  const handleAddComponent = (comp: string) => {
    if (!components.includes(comp)) setComponents([...components, comp]);
  };
  const handleRemoveComponent = (comp: string) => {
    setComponents(components.filter(c => c !== comp));
  };

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (budget && timeline && brief.trim()) {
      const estimate = estimateProject({
        components,
        brief,
        timeline,
        reliability,
        scale,
      });

      setResult({
        priceLabel: formatCurrency(estimate.basePrice),
        rangeLabel: `${formatCurrency(estimate.priceLow)} to ${formatCurrency(estimate.priceHigh)}`,
        hoursLabel: `${estimate.hours} hours at ${formatCurrency(estimate.hourlyRate)}/hr`,
        recommendation: estimate.recommendation,
        assumptions: estimate.assumptions.slice(0, 5),
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitWebsiteForm({
        subject: `Quote request from ${name}`,
        from_name: 'Selerim Quote Form',
        name,
        email,
        company,
        budget_range: budget,
        timeline,
        reliability_target: reliability,
        expected_scale: scale,
        main_components: components.length ? components.join(', ') : 'None selected',
        project_brief: brief,
        estimate_price: result?.priceLabel || '',
        estimate_range: result?.rangeLabel || '',
        estimate_workload: result?.hoursLabel || '',
        estimate_recommendation: result?.recommendation || '',
        estimate_assumptions: result?.assumptions.join(', ') || '',
        source: 'instant-quote',
      });

      notify({ 
        message: 'Quote request submitted. We’ll review it and follow up with next steps.', 
        type: 'success' 
      });
      setStep('budget');
      setBudget('');
      setTimeline('');
      setComponents([]);
      setBrief('');
      setReliability('elevated');
      setScale('startup');
      setCompany('');
      setName('');
      setEmail('');
      setResult(null);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('closeQuoteModal'));
      }
    } catch (error) {
      notify({
        message: error instanceof Error ? error.message : 'Unable to submit the quote request right now.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 sm:p-8 max-w-3xl mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">Get an Instant Quote</h2>
      
      {!result ? (
        step === 'budget' ? (
          <form onSubmit={handleBudgetSubmit} className="space-y-6">
            <div>
              <label className="block text-white/80 mb-3 text-lg">Budget Range</label>
              <select
                className="w-full rounded-lg glass-card text-white px-6 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                required
              >
                <option value="">Select budget</option>
                {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-white/80 mb-3 text-lg">Timeline</label>
              <select
                className="w-full rounded-lg glass-card text-white px-6 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                value={timeline}
                onChange={e => setTimeline(e.target.value)}
                required
              >
                <option value="">Select timeline</option>
                {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-white/80 mb-3 text-lg">Project Brief</label>
              <textarea
                className="min-h-32 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-base text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                value={brief}
                onChange={e => setBrief(e.target.value)}
                placeholder="Describe the product, the workflows that matter, any AI features, integrations, or uptime expectations."
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-white/80 mb-3 text-lg">Reliability</label>
                <select
                  className="w-full rounded-lg glass-card text-white px-6 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                  value={reliability}
                  onChange={e => setReliability(e.target.value as 'standard' | 'elevated' | 'critical')}
                >
                  <option value="standard">Standard product uptime</option>
                  <option value="elevated">Elevated reliability</option>
                  <option value="critical">Mission-critical reliability</option>
                </select>
              </div>
              <div>
                <label className="block text-white/80 mb-3 text-lg">Expected Scale</label>
                <select
                  className="w-full rounded-lg glass-card text-white px-6 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                  value={scale}
                  onChange={e => setScale(e.target.value as 'internal' | 'startup' | 'growth' | 'scale')}
                >
                  <option value="internal">Internal team tool</option>
                  <option value="startup">Early product launch</option>
                  <option value="growth">Growth-stage product</option>
                  <option value="scale">Large-scale customer traffic</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-white/80 mb-3 text-lg">Main Components (optional)</label>
              <ComponentPills
                selected={components}
                onSelect={handleAddComponent}
                onRemove={handleRemoveComponent}
                onAdd={handleAddComponent}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-blue-400 via-fuchsia-400 to-pink-400 text-white font-bold py-4 text-xl shadow hover:opacity-90 transition glow-on-hover glow-on-click"
            >
              Get Instant Estimate
            </button>
          </form>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div>
              <label className="block text-white/80 mb-2 text-lg">Name</label>
              <input
                type="text"
                className="w-full rounded-lg glass-card text-white px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2 text-lg">Email</label>
              <input
                type="email"
                className="w-full rounded-lg glass-card text-white px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2 text-lg">Company</label>
              <input
                type="text"
                className="w-full rounded-lg glass-card text-white px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Company or brand"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2 text-lg">Budget Range</label>
              <select
                className="w-full rounded-lg glass-card text-white px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                required
              >
                <option value="">Select budget</option>
                {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-white/80 mb-2 text-lg">Timeline</label>
              <select
                className="w-full rounded-lg glass-card text-white px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                value={timeline}
                onChange={e => setTimeline(e.target.value)}
                required
              >
                <option value="">Select timeline</option>
                {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-white/80 mb-2 text-lg">Project Brief</label>
              <textarea
                className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-base text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                value={brief}
                onChange={e => setBrief(e.target.value)}
                required
                placeholder="Anything we should know before we scope this properly?"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2 text-lg">Main Components</label>
              <ComponentPills
                selected={components}
                onSelect={handleAddComponent}
                onRemove={handleRemoveComponent}
                onAdd={handleAddComponent}
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-full bg-gradient-to-r from-blue-400 via-fuchsia-400 to-pink-400 text-white font-bold py-4 text-xl shadow hover:opacity-90 transition glow-on-hover glow-on-click"
              >
                {loading ? 'Sending...' : 'Request Detailed Quote'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('budget');
                  setBudget('');
                  setTimeline('');
                  setComponents([]);
                  setBrief('');
                  setReliability('elevated');
                  setScale('startup');
                  setCompany('');
                  setName('');
                  setEmail('');
                }}
                className="glass-button text-white font-semibold px-8 py-4 text-lg hover:bg-white/20 transition glow-on-hover glow-on-click"
              >
                Start Over
              </button>
            </div>
          </form>
        )
      ) : (
        <QuoteResultModal 
          result={result} 
          onClose={() => setResult(null)} 
          onGetQuote={() => {
            setResult(null);
            setStep('form');
          }}
        />
      )}
    </div>
  );
};

export default InstantQuoteForm;
