import Link from "next/link";
import { AUDIT_CTA, offers, concepts, process, faqs } from "@/lib/marketing";
import Intake from "./Intake";

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function AuditLink({
  href = "/contact",
  secondary = false,
}: {
  href?: string;
  secondary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`action ${secondary ? "action-secondary" : "action-primary"}`}
    >
      {AUDIT_CTA}
      <Arrow />
    </Link>
  );
}
export function Intro({
  eyebrow,
  title,
  accent,
  description,
  as: Heading = "h2",
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="section-intro" data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <Heading>
        {title} {accent && <em>{accent}</em>}
      </Heading>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}
export function PageIntro({
  eyebrow,
  title,
  accent,
  description,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description: string;
}) {
  return (
    <div className="page-intro wrap">
      <p className="eyebrow">{eyebrow}</p>
      <h1>
        {title} {accent && <em>{accent}</em>}
      </h1>
      <p>{description}</p>
    </div>
  );
}

export function Offers() {
  return (
    <section id="offers" className="section wrap">
      <Intro
        eyebrow="02 / Clear scope. Clear investment."
        title="Start with the right question."
        accent="Then build the answer."
        description="A small, deliberate first step. A fixed-price build when the opportunity is clear."
      />
      <div className="offer-grid">
        {offers.map((offer) => (
          <article
            className={`offer-card ${offer.id === "audit" ? "offer-featured" : ""}`}
            key={offer.id}
            data-reveal
          >
            <div className="card-top">
              <span className="eyebrow">{offer.label}</span>
              <span className="index-number">{offer.number}</span>
            </div>
            <h3>{offer.name}</h3>
            <p className="offer-description">{offer.description}</p>
            <p className="offer-price">{offer.price}</p>
            <p className="offer-timing">{offer.timing}</p>
            <ul className="check-list">
              {offer.items.map((item) => (
                <li key={item}>
                  <span aria-hidden="true">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            {offer.id === "audit" ? (
              <AuditLink />
            ) : (
              <Link href="/contact" className="action action-secondary">
                Start with an audit
                <Arrow />
              </Link>
            )}
            <p className="fine-print">{offer.note}</p>
          </article>
        ))}
      </div>
      <p className="section-footnote">
        USD. Timelines begin at kickoff with agreed inputs and access in place.
        Third-party usage and hosting are separate.
      </p>
    </section>
  );
}
export function Proof() {
  return (
    <section id="proof" className="section wrap">
      <Intro
        eyebrow="01 / The possibilities, made concrete"
        title="Real workflows."
        accent="Thoughtful possibilities."
        description="Two working concept builds, demonstrated with fictional data. Watch the review flows and inspect the measured fixture results. These are not client engagements."
      />
      <div className="concept-grid">
        {concepts.map((c) => (
          <article className="concept-card" key={c.id} data-reveal>
            <div className="concept-visual">
              <div className="card-top">
                <span className="label-pill">Concept build</span>
                <span className="eyebrow">
                  {c.number} / {c.id}
                </span>
              </div>
              <h3>{c.title}</h3>
              <div className="concept-video">
                <video controls playsInline preload="none" poster={c.poster} width="1440" height="960" aria-label={`${c.name}: narrated concept walkthrough`}>
                  <source src={c.video} type="video/mp4" />
                  <track kind="captions" src={c.captions} srcLang="en" label="English" />
                  <a href={c.video}>Download the walkthrough</a>
                </video>
                <div className="concept-video-caption">
                  <span>Fictional data · deterministic baseline</span>
                  <a href={c.transcript}>Read transcript ↗</a>
                </div>
                <p className="concept-recording-note">Narrated tour of captured application states. Synthetic voice; no live model in this recording.</p>
              </div>
            </div>
            <div className="concept-body">
              <p className="eyebrow">{c.industry}</p>
              <h4>{c.name}</h4>
              <dl>
                <dt>The problem</dt>
                <dd>{c.problem}</dd>
                <dt>What the concept does</dt>
                <dd>{c.action}</dd>
                <dt>Security by design</dt>
                <dd>{c.security}</dd>
              </dl>
              <div className="concept-metric">
                <span className="eyebrow">Measured fixture result</span>
                <strong>{c.metric}</strong>
                <p>{c.measure}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="case-study-empty" data-reveal>
        <span className="empty-mark" aria-hidden="true">
          ＋
        </span>
        <div>
          <h3>Evidence belongs here.</h3>
          <p>
            Future client case studies will include the workflow, security
            approach, a measured before-and-after, and a walkthrough—with client
            permission.
          </p>
        </div>
        <span className="label-pill">Client studies forthcoming</span>
      </div>
    </section>
  );
}
export function Process() {
  return (
    <section id="process" className="section wrap process-layout">
      <div className="process-sticky">
        <Intro
          eyebrow="03 / A considered way to build"
          title="From possibility"
          accent="to something you own."
          description="Four clear stages. Written decisions. Working progress you can review on your schedule."
        />
        <p className="process-aside">
          You work directly with the engineer doing the work. No handoffs
          between sales and delivery.
        </p>
        <Link href="/contact" className="text-link">
          Tell us about your workflow
          <Arrow />
        </Link>
      </div>
      <div className="process-steps">
        {process.map((step, i) => (
          <article
            key={step.name}
            data-step
            data-reveal
            className="process-step"
          >
            <span className="step-number">0{i + 1}</span>
            <div>
              <div className="step-title">
                <h3>{step.name}</h3>
                <span>{step.time}</span>
              </div>
              <p>{step.description}</p>
              <div className="step-output">
                <span aria-hidden="true">↳</span>
                {step.output}
              </div>
            </div>
          </article>
        ))}
        <div className="care-card" data-reveal>
          <div>
            <p className="eyebrow">Optional, after handover</p>
            <h3>Keep it in good hands.</h3>
          </div>
          <p className="care-price">
            $1,500–$3,000<span>/ month</span>
          </p>
          <p>
            Monitoring, evaluation reviews, maintenance, and small improvements
            within an agreed care scope. You can also run it independently. No
            required retainer.
          </p>
        </div>
      </div>
    </section>
  );
}
export function Security() {
  return (
    <section id="security" className="section security-section">
      <div className="wrap">
        <div className="security-header" data-reveal>
          <span className="security-emblem" aria-hidden="true">
            <svg width="40" height="44" viewBox="0 0 40 44" fill="none">
              <path
                d="M20 3 35 9v12c0 9-15 19-15 19S5 30 5 21V9L20 3Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="m13 21 5 5 10-11"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </span>
          <p className="eyebrow">Your business is not a public dataset.</p>
        </div>
        <div className="security-layout">
          <Intro
            eyebrow="04 / Secure & confidential by design"
            title="Useful AI."
            accent="Sensible boundaries."
            description="Security is part of the scope, not a line added at the end. We agree on how your information is accessed, processed, and retained before connecting an agent."
          />
          <div className="security-grid">
            {[
              [
                "01",
                "Only the access it needs",
                "Scoped permissions and a defined data boundary. We avoid giving an agent unrestricted access to your business.",
              ],
              [
                "02",
                "Your people stay in control",
                "Human review for consequential actions. An agent can prepare the next step without quietly taking it for you.",
              ],
              [
                "03",
                "Confidentiality, made explicit",
                "NDA available. Data handling, model-provider settings, and retention are reviewed for your requirements.",
              ],
              [
                "04",
                "A system you can take with you",
                "Client-owned code, keys, accounts, and documentation. Clear dependencies and a practical handover.",
              ],
            ].map(([n, title, body]) => (
              <article key={n} data-reveal>
                <span className="eyebrow">{n}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
export function Trust() {
  return (
    <section id="studio" className="section wrap trust-layout">
      <div className="founder-card" data-reveal>
        <div className="founder-monogram" aria-hidden="true">
          dm<span>↗</span>
        </div>
        <div>
          <p className="eyebrow">Your direct point of contact</p>
          <h2>Daniel Mireles</h2>
          <p>Founder & senior software engineer</p>
          <span className="location">
            <span aria-hidden="true">◎</span> Houston, Texas · Working with US
            businesses
          </span>
        </div>
      </div>
      <div>
        <Intro
          eyebrow="05 / Small studio. Direct accountability."
          title="Senior work."
          accent="Without the meeting overhead."
          description="Selerim is a founder-led, senior-only AI integration studio. The person shaping your workflow is the person building it."
        />
        <div className="trust-details">
          <div>
            <strong>Async by default</strong>
            <p>
              Clear written updates, recorded walkthroughs, and a shared
              decision log.
            </p>
          </div>
          <div>
            <strong>A reply within 24 hours</strong>
            <p>
              Calls by appointment when useful. No daily meeting requirement or
              24/7 on-call promise.
            </p>
          </div>
          <div>
            <strong>Everything you need to own it</strong>
            <p>
              Source code, project keys, documentation, and a handover your team
              can use.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
export function FAQ() {
  return (
    <section id="faq" className="section wrap faq-layout">
      <Intro
        eyebrow="06 / Before we begin"
        title="Good questions."
        accent="Straight answers."
        description="The practical details of working together, from the first audit to the final handover."
      />
      <div className="faq-list">
        {faqs.map((faq, i) => (
          <details key={faq.q} data-reveal>
            <summary>
              <span className="faq-number">0{i + 1}</span>
              <h3>{faq.q}</h3>
              <span className="faq-plus" aria-hidden="true">
                +
              </span>
            </summary>
            <p>{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
export function IntakeSection({ standalone = false }: { standalone?: boolean }) {
  return (
    <section id="intake" className="section intake-section">
      <div className="wrap intake-layout">
        <div>
          <Intro
            as={standalone ? "h1" : "h2"}
            eyebrow={standalone ? "Request an audit / Start with one workflow" : "07 / Start with one workflow"}
            title="What is taking up"
            accent="too much of your team’s time?"
            description="Tell us what is manual, repetitive, or breaking. We’ll review the fit and reply within 24 hours with a practical next step."
          />
          <div className="intake-summary">
            <strong>AI Opportunity Audit</strong>
            <p>
              <span>$2,500</span> / 14 days
            </p>
            <p>
              No payment at this step. If it is a fit, we agree the audit scope
              and send an invoice before kickoff.
            </p>
          </div>
          <p className="intake-privacy">
            A high-level description is enough. Please do not include
            confidential documents, credentials, or personal client data. We can
            arrange an NDA before sensitive discussions.
          </p>
        </div>
        <Intake />
      </div>
    </section>
  );
}
export function Closing() {
  return (
    <section className="section wrap closing" data-reveal>
      <p className="eyebrow">A useful next step</p>
      <h2>
        Give your team more room
        <br />
        <em>to do what matters.</em>
      </h2>
      <AuditLink />
      <p>$2,500 audit · 14 days · No obligation to build</p>
    </section>
  );
}
