'use client';

import React, { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNotification } from './NotificationProvider';
import { estimateProject, formatCurrency } from '../lib/quote-estimator';
import { submitWebsiteForm } from '../lib/form-submit';

const MAIN_COMPONENTS = [
  'Auth', 'Login', 'Location', 'Push Notifications', 'Payments', 'Chat', 'Profile', 'Feed', 'Search', 'Settings', 'Analytics', 'Admin Panel', 'File Upload', 'Calendar', 'Notifications',
];

const BUDGETS = ['Unknown', 'Under $10k', '$10k-$25k', '$25k-$50k', '$50k-$100k', '$100k+'];
const TIMELINES = ['Unknown', '1-2 weeks', '2-4 weeks', '1-2 months', '2-4 months', '4+ months'];

const FIELD =
  'block w-full rounded-xl border border-line bg-[var(--surface-2)]/60 px-4 py-3 text-[0.97rem] text-ink placeholder:text-ink-subtle outline-none transition-all duration-300 focus:border-brand focus:ring-2 focus:ring-brand/25';
const LABEL = 'mb-2 block text-sm font-medium text-ink-muted';

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
        <span key={comp} className="flex items-center gap-1 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-sm text-ink">
          {comp}
          <button type="button" className="text-ink-subtle transition-colors hover:text-ink" onClick={() => onRemove(comp)} aria-label={`Remove ${comp}`}>
            <XMarkIcon className="h-4 w-4" />
          </button>
        </span>
      ))}
      {MAIN_COMPONENTS.filter((c) => !selected.includes(c)).slice(0, 15).map((comp) => (
        <button
          key={comp}
          type="button"
          className="rounded-full border border-line px-3 py-1 text-sm text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
          onClick={() => onSelect(comp)}
        >
          {comp}
        </button>
      ))}
      {adding ? (
        <div className="flex items-center gap-1">
          <input
            autoFocus
            className="rounded-full border border-line bg-[var(--surface-2)]/60 px-3 py-1 text-sm text-ink outline-none focus:border-brand"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
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
            className="rounded-full border border-line px-3 py-1 text-sm text-ink transition-colors hover:border-line-strong"
          >
            Add
          </button>
          <button type="button" className="text-ink-subtle hover:text-ink" onClick={() => { setAdding(false); setInput(''); }}>
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="flex items-center gap-1 rounded-full border border-line px-3 py-1 text-sm text-ink transition-colors hover:border-line-strong"
          onClick={() => setAdding(true)}
        >
          <PlusIcon className="h-4 w-4" /> Add
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
    <div className="fixed inset-0 z-[95] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-md sm:p-8">
      <div className="glass-strong relative mx-auto w-full max-w-2xl rounded-[2rem] p-8 text-center sm:p-12">
        <button className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-subtle transition-colors hover:text-ink" onClick={onClose} aria-label="Close">
          <XMarkIcon className="h-5 w-5" />
        </button>
        <p className="eyebrow mb-5">Your instant quote</p>
        <div className="text-gradient font-serif text-6xl italic md:text-7xl">{result.priceLabel}</div>
        <div className="mt-3 text-lg text-ink-muted">{result.rangeLabel}</div>
        <div className="mt-2 text-xs uppercase tracking-[0.22em] text-ink-subtle">{result.hoursLabel}</div>
        <p className="mx-auto mt-6 max-w-lg text-[0.97rem] text-ink">{result.recommendation}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {result.assumptions.map((a) => (
            <span key={a} className="rounded-full border border-line px-3 py-1 text-sm text-ink-muted">{a}</span>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-md text-sm text-ink-subtle">
          This is an estimate. We recommend a quick call to review your needs — final pricing may change after a detailed review.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={onGetQuote} className="btn btn-brand h-12 px-7 text-base">Get detailed quote</button>
          <a href="/contact" className="btn btn-ghost h-12 px-7 text-base">Contact us</a>
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
    setComponents(components.filter((c) => c !== comp));
  };

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (budget && timeline && brief.trim()) {
      const estimate = estimateProject({ components, brief, timeline, reliability, scale });
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

      notify({ message: 'Quote request submitted. We’ll review it and follow up with next steps.', type: 'success' });
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
    <div className="glass-strong mx-auto max-h-[90vh] max-w-3xl overflow-y-auto rounded-[2rem] p-6 sm:p-9">
      <p className="eyebrow mb-2">Instant quote</p>
      <h2 className="display mb-7 text-3xl text-ink sm:text-4xl">
        Estimate your <span className="accent text-gradient">build.</span>
      </h2>

      {!result ? (
        step === 'budget' ? (
          <form onSubmit={handleBudgetSubmit} className="space-y-5">
            <div>
              <label className={LABEL}>Budget range</label>
              <select className={FIELD} value={budget} onChange={(e) => setBudget(e.target.value)} required>
                <option value="">Select budget</option>
                {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Timeline</label>
              <select className={FIELD} value={timeline} onChange={(e) => setTimeline(e.target.value)} required>
                <option value="">Select timeline</option>
                {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Project brief</label>
              <textarea
                className={`${FIELD} min-h-32`}
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Describe the product, the workflows that matter, any AI features, integrations, or uptime expectations."
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={LABEL}>Reliability</label>
                <select className={FIELD} value={reliability} onChange={(e) => setReliability(e.target.value as typeof reliability)}>
                  <option value="standard">Standard product uptime</option>
                  <option value="elevated">Elevated reliability</option>
                  <option value="critical">Mission-critical reliability</option>
                </select>
              </div>
              <div>
                <label className={LABEL}>Expected scale</label>
                <select className={FIELD} value={scale} onChange={(e) => setScale(e.target.value as typeof scale)}>
                  <option value="internal">Internal team tool</option>
                  <option value="startup">Early product launch</option>
                  <option value="growth">Growth-stage product</option>
                  <option value="scale">Large-scale customer traffic</option>
                </select>
              </div>
            </div>
            <div>
              <label className={LABEL}>Main components (optional)</label>
              <ComponentPills selected={components} onSelect={handleAddComponent} onRemove={handleRemoveComponent} onAdd={handleAddComponent} />
            </div>
            <button type="submit" className="btn btn-brand h-13 w-full text-base" style={{ height: '3.25rem' }}>
              Get instant estimate
            </button>
          </form>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={LABEL}>Name</label>
                <input type="text" className={FIELD} value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" />
              </div>
              <div>
                <label className={LABEL}>Email</label>
                <input type="email" className={FIELD} value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@email.com" />
              </div>
            </div>
            <div>
              <label className={LABEL}>Company</label>
              <input type="text" className={FIELD} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company or brand" />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={LABEL}>Budget range</label>
                <select className={FIELD} value={budget} onChange={(e) => setBudget(e.target.value)} required>
                  <option value="">Select budget</option>
                  {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL}>Timeline</label>
                <select className={FIELD} value={timeline} onChange={(e) => setTimeline(e.target.value)} required>
                  <option value="">Select timeline</option>
                  {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={LABEL}>Project brief</label>
              <textarea className={`${FIELD} min-h-28`} value={brief} onChange={(e) => setBrief(e.target.value)} required placeholder="Anything we should know before we scope this properly?" />
            </div>
            <div>
              <label className={LABEL}>Main components</label>
              <ComponentPills selected={components} onSelect={handleAddComponent} onRemove={handleRemoveComponent} onAdd={handleAddComponent} />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="submit" disabled={loading} className="btn btn-brand h-13 flex-1 text-base disabled:opacity-60" style={{ height: '3.25rem' }}>
                {loading ? 'Sending…' : 'Request detailed quote'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('budget');
                  setBudget(''); setTimeline(''); setComponents([]); setBrief('');
                  setReliability('elevated'); setScale('startup'); setCompany(''); setName(''); setEmail('');
                }}
                className="btn btn-ghost px-7 text-base"
                style={{ height: '3.25rem' }}
              >
                Start over
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
