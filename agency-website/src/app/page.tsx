import Link from "next/link";
import Workflow from "@/components/marketing/Workflow";
import {
  AuditLink,
  Arrow,
  Proof,
  Offers,
  Process,
  Security,
  Trust,
  FAQ,
  IntakeSection,
} from "@/components/marketing/Sections";
export default function Home() {
  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">
            <span aria-hidden="true" />
            Founder-led AI integration · Houston, TX
          </p>
          <h1>
            AI agents for
            <br />
            your <em>business.</em>
          </h1>
          <p className="hero-promise">
            Secure. Confidential. <span>Built for growth.</span>
          </p>
          <p className="hero-description">
            Give your team back the time lost to repetitive work. We build
            agents that connect to your systems—with clear data boundaries and
            people in control—so you can focus on growth.
          </p>
          <div className="hero-actions">
            <AuditLink href="#intake" />
            <Link className="text-link" href="#proof">
              Explore the possibilities
              <Arrow />
            </Link>
          </div>
          <p className="hero-note">
            $2,500 audit <span>·</span> 14 days <span>·</span> A clear plan
            before you build
          </p>
        </div>
        <Workflow />
      </section>
      <div className="fit-strip wrap">
        <p>
          Built for the work
          <br />
          <strong>behind the business.</strong>
        </p>
        <div>
          <span aria-hidden="true">↗</span>Energy & field operations
        </div>
        <div>
          <span aria-hidden="true">↗</span>Logistics & supply chains
        </div>
        <div>
          <span aria-hidden="true">↗</span>Legal & professional services
        </div>
        <p className="fit-detail">
          For operations-heavy US businesses.
          <br />
          Designed with $5–100M SMBs in mind.
        </p>
      </div>
      <Proof />
      <Offers />
      <Process />
      <Security />
      <Trust />
      <FAQ />
      <IntakeSection />
    </>
  );
}
