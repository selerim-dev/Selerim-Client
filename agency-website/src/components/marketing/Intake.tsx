"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { submitWebsiteForm } from "@/lib/form-submit";
import {
  intakeSchema,
  revenueBands,
  timelines,
  budgets,
} from "@/lib/intake-schema";

export default function Intake() {
  const [state, setState] = useState<"idle" | "sending" | "success">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const parsed = intakeSchema.safeParse(data);
    setError("");
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        next[String(i.path[0])] = i.message;
      });
      setErrors(next);
      const field = form.elements.namedItem(Object.keys(next)[0]);
      if (field instanceof HTMLElement) field.focus();
      return;
    }
    setErrors({});
    setState("sending");
    try {
      const { workflow, ...details } = parsed.data;
      delete details.website;
      await submitWebsiteForm({
        ...details,
        message: workflow,
        subject: "Selerim — AI Opportunity Audit inquiry",
        from_name: "Selerim Website",
        source: "audit-intake",
      });
      setState("success");
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setState("idle");
      setError(
        "We couldn’t confirm your submission. Your answers are still here. Please try again, or email admin@selerim.com.",
      );
    }
  }
  const help = (name: string) =>
    errors[name] ? (
      <span id={`${name}-error`} className="field-error">
        {errors[name]}
      </span>
    ) : null;
  const props = (name: string) => ({
    id: `intake-${name}`,
    name,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  if (state === "success")
    return (
      <div
        className="intake-form intake-success"
        tabIndex={-1}
        ref={successRef}
        role="status"
      >
        <span className="success-mark" aria-hidden="true">
          ✓
        </span>
        <p className="eyebrow">You’re in the right place</p>
        <h3>Thanks. Daniel will take it from here.</h3>
        <p>
          Expect a personal reply within 24 hours. We’ll review your workflow
          and confirm whether the $2,500 AI Opportunity Audit is a good fit.
        </p>
        <ol>
          <li>We clarify the workflow and any missing context by email.</li>
          <li>If it is a fit, you receive the audit scope and invoice.</li>
          <li>Your 14-day audit starts at the agreed kickoff.</li>
        </ol>
        <p>
          No payment has been taken. Calls are by appointment; we’ll keep the
          next steps async.
        </p>
        <button
          className="action action-secondary"
          onClick={() => setState("idle")}
        >
          Describe another workflow
        </button>
      </div>
    );
  return (
    <form
      className="intake-form"
      ref={formRef}
      onSubmit={submit}
      noValidate
      aria-label="AI opportunity audit intake"
    >
      <div className="card-top">
        <p className="eyebrow">Tell us a little about the work</p>
        <span className="fine-print">About 3 minutes</span>
      </div>
      <div className="form-grid">
        <div>
          <label htmlFor="intake-name">Your name</label>
          <input
            {...props("name")}
            autoComplete="name"
            required
            maxLength={100}
            placeholder="First and last name"
          />
          {help("name")}
        </div>
        <div>
          <label htmlFor="intake-email">Work email</label>
          <input
            {...props("email")}
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@company.com"
          />
          {help("email")}
        </div>
      </div>
      <div className="form-grid">
        <div>
          <label htmlFor="intake-company">Company</label>
          <input
            {...props("company")}
            required
            autoComplete="organization"
            maxLength={150}
            placeholder="Company name"
          />
          {help("company")}
        </div>
        <div>
          <label htmlFor="intake-revenue">Annual revenue (USD)</label>
          <select {...props("revenue")} required defaultValue="">
            <option value="" disabled>
              Select a band
            </option>
            {revenueBands.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          {help("revenue")}
        </div>
      </div>
      <div>
        <label htmlFor="intake-workflow">What’s manual or breaking?</label>
        <textarea
          {...props("workflow")}
          required
          rows={4}
          minLength={20}
          maxLength={3000}
          placeholder="What does your team do repeatedly? Where do things slow down, get missed, or need rework?"
        />
        {help("workflow")}
      </div>
      <div>
        <label htmlFor="intake-systems">Which systems do you use?</label>
        <input
          {...props("systems")}
          required
          maxLength={1000}
          placeholder="e.g. Microsoft 365, Excel, your CRM or ERP"
        />
        {help("systems")}
      </div>
      <div className="form-grid">
        <div>
          <label htmlFor="intake-timeline">Timeline</label>
          <select {...props("timeline")} defaultValue="" required>
            <option value="" disabled>
              Select a timeline
            </option>
            {timelines.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          {help("timeline")}
        </div>
        <div>
          <label htmlFor="intake-budget">Budget band</label>
          <select {...props("budget")} defaultValue="" required>
            <option value="" disabled>
              Select a budget
            </option>
            {budgets.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          {help("budget")}
        </div>
      </div>
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="intake-website">Leave this field empty</label>
        <input
          id="intake-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {Object.keys(errors).length > 0 && (
        <p role="alert" className="field-error">
          Please check the highlighted fields.
        </p>
      )}
      {error && (
        <p role="alert" className="form-error">
          {error} <a href="mailto:admin@selerim.com">Email Daniel →</a>
        </p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="action action-primary"
      >
        {state === "sending"
          ? "Sending your inquiry…"
          : "Get an AI opportunity audit"}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="form-note">
        All fields required. We use these details to respond to your inquiry.{" "}
        <Link href="/privacy">Privacy policy</Link>
      </p>
    </form>
  );
}
