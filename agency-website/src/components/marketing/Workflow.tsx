"use client";
import { useState } from "react";
const flows = [
  {
    sector: "Logistics",
    title: "From paperwork to progress.",
    input: "Delivery documents",
    system: "Shipment records",
    action: "Match documents. Flag gaps.",
    review: "Operations review",
    result: "Follow-up ready for approval",
    label: "Shipment workflow",
  },
  {
    sector: "Energy",
    title: "From field notes to next steps.",
    input: "Field service reports",
    system: "Work order system",
    action: "Extract details. Flag exceptions.",
    review: "Supervisor review",
    result: "Work order update ready to review",
    label: "Field service workflow",
  },
  {
    sector: "Legal",
    title: "From intake to a clear brief.",
    input: "Matter intake documents",
    system: "Document workspace",
    action: "Organize records. Draft a summary.",
    review: "Attorney review",
    result: "Source-linked intake brief",
    label: "Matter intake workflow",
  },
];
export default function Workflow() {
  const [active, setActive] = useState(0);
  const flow = flows[active];
  return (
    <div className="workflow-shell">
      <div className="workflow-toolbar">
        <span className="eyebrow">The work, reimagined</span>
        <span className="status-dot" aria-hidden="true" />
      </div>
      <div className="workflow-tabs" aria-label="Explore a workflow">
        {flows.map((item, i) => (
          <button
            type="button"
            key={item.sector}
            aria-pressed={active === i}
            onClick={() => setActive(i)}
          >
            {item.sector}
          </button>
        ))}
      </div>
      <div className="workflow-content" aria-live="polite" aria-atomic="true">
        <p className="workflow-title">{flow.title}</p>
        <div className="flow-inputs">
          <div>
            <span aria-hidden="true">↳</span>
            {flow.input}
          </div>
          <div>
            <span aria-hidden="true">⌘</span>
            {flow.system}
          </div>
        </div>
        <div className="flow-connector" aria-hidden="true">
          <i />
        </div>
        <div className="agent-node">
          <div className="agent-symbol" aria-hidden="true">
            ✳
          </div>
          <div>
            <span className="eyebrow">Your AI agent</span>
            <p>{flow.action}</p>
          </div>
          <span className="node-badge">Scoped access</span>
        </div>
        <div className="flow-connector" aria-hidden="true">
          <i />
        </div>
        <div className="review-node">
          <span className="review-check" aria-hidden="true">
            ✓
          </span>
          <div>
            <strong>{flow.review}</strong>
            <p>{flow.result}</p>
          </div>
        </div>
      </div>
      <div className="workflow-foot">
        <span>Human approval stays in the loop.</span>
        <span>Illustrative workflow · no client data</span>
      </div>
    </div>
  );
}
