export const AUDIT_CTA = "Get an AI opportunity audit";
export const CONTACT = "admin@selerim.com";
export const offers = [
  {
    id: "audit",
    number: "01",
    label: "Start with clarity",
    name: "AI Opportunity Audit",
    price: "$2,500",
    timing: "14 days · fixed price",
    description:
      "Find the workflow worth automating before you invest in a build.",
    items: [
      "Ranked use cases, scored by value and feasibility",
      "Data-readiness check across your current systems",
      "Security and confidentiality review",
      "A fixed-price quote for the recommended build",
    ],
    note: "A decision you can act on. No obligation to build with us.",
  },
  {
    id: "build",
    number: "02",
    label: "Put the plan to work",
    name: "30-Day Agent Build",
    price: "$7,500–$15,000",
    timing: "30 days · fixed scope",
    description:
      "One workflow. One accountable engineer. A working agent your team owns.",
    items: [
      "One workflow or agent, connected to your systems",
      "An evaluation harness with agreed acceptance checks",
      "Documentation, training, and a clear handover",
      "Your code, accounts, keys, and documentation",
    ],
    note: "Your exact price is agreed after the audit, before development.",
  },
];
export const concepts = [
  {
    id: "logistics",
    number: "01",
    industry: "Logistics & field operations",
    title: "Less chasing. More moving.",
    name: "Shipment document agent",
    problem:
      "Delivery paperwork arrives across inboxes and folders. Your team spends hours matching it to shipments and chasing gaps.",
    action:
      "Match incoming documents to shipment records, flag missing information, and draft a follow-up for a person to approve.",
    security:
      "Scoped document access, an activity log, and human approval before any message is sent.",
    metric: "Minutes of manual review per shipment",
    measure:
      "Compare a sample workflow with the current process. Baseline and results have not yet been measured.",
    steps: ["Document received", "Match & check", "Human review"],
    video: null,
  },
  {
    id: "legal",
    number: "02",
    industry: "Legal & professional services",
    title: "A clearer first review.",
    name: "Matter intake agent",
    problem:
      "New-matter emails and attachments create a queue of repetitive sorting, data entry, and missing-information checks.",
    action:
      "Organize intake documents, draft a source-linked summary, and route incomplete submissions to the right person.",
    security:
      "Matter-scoped access, minimal retained data, and attorney review. No autonomous legal advice or decisions.",
    metric: "Minutes to prepare an intake for review",
    measure:
      "Evaluate against staff-reviewed examples. Baseline and results have not yet been measured.",
    steps: ["Intake received", "Organize & draft", "Attorney review"],
    video: null,
  },
];
export const process = [
  {
    name: "Audit",
    time: "14 days",
    description:
      "We map the repetitive work, check the data, and rank the opportunities. You get a practical recommendation—even if the best answer is not AI.",
    output: "Opportunity map + security review",
  },
  {
    name: "Blueprint",
    time: "Before the build",
    description:
      "We agree on one workflow, its permissions, the success measures, and the fixed price. You know what will ship before development starts.",
    output: "Agreed scope + acceptance criteria",
  },
  {
    name: "Build",
    time: "30 days",
    description:
      "Your agent takes shape in a reviewable environment. You see working progress, test realistic examples, and approve consequential actions.",
    output: "One agent + evaluation harness",
  },
  {
    name: "Handover",
    time: "Built into delivery",
    description:
      "Code, keys, accounts, documentation, and training belong with your team. Keep running it yourself or choose an optional care plan.",
    output: "Your system. Your ownership.",
  },
];
export const faqs = [
  {
    q: "How do you protect our data and confidentiality?",
    a: "We agree on confidentiality terms and can sign an NDA before sensitive access. The audit defines which data is needed, where it can run, who can access it, and the retention and model-provider settings required. Builds use scoped access and human approval for consequential actions. Please keep confidential documents, credentials, and personal data out of the initial intake.",
  },
  {
    q: "What does the $2,500 audit include?",
    a: "A 14-day review with ranked use cases, a data-readiness check, a security and confidentiality review, and a fixed-price quote for the recommended build. You keep the findings and can use them with your own team. There is no obligation to buy a build.",
  },
  {
    q: "How long does an engagement take?",
    a: "The audit takes 14 days from kickoff with the agreed inputs available. The build is a separate, fixed-scope 30-day engagement after we agree the blueprint and have the required access. We confirm dates before starting and surface any client-access or third-party dependency that could affect them.",
  },
  {
    q: "What will you need from our team?",
    a: "One decision-maker, a description of the workflow, representative examples with sensitive information removed where possible, and access to the systems in scope. During a build, we ask for timely written feedback and a small set of realistic examples to test against. The blueprint makes those responsibilities explicit.",
  },
  {
    q: "What if AI is not a fit, or the agent does not work?",
    a: "The audit can recommend a simpler automation—or no build. For a build, we agree on acceptance criteria and test them with an evaluation harness. If an agreed check fails, we investigate and address it within the agreed scope before sign-off; additional scope needs your approval. Acceptance, remedies, and commercial terms are set out in the service agreement. We do not promise unmeasured ROI.",
  },
  {
    q: "Who owns the code, keys, and documentation?",
    a: "You own the custom deliverables: source code, documentation, and the accounts and keys created for your project, under the agreed contract. Third-party platforms and open-source libraries retain their own licenses. You can run the system with your team or another provider; ongoing care is optional.",
  },
  {
    q: "How does async collaboration work?",
    a: "You work directly with Daniel through written updates, recorded walkthroughs, and a shared decision log. Expect a response within 24 hours; calls are by appointment when a conversation will help. This is an async-first studio, not a 24/7 on-call service. You do not need to attend daily meetings.",
  },
  {
    q: "What happens after handover?",
    a: "You can take over completely or add care at $1,500–$3,000 per month for an agreed scope of monitoring, evaluation reviews, maintenance, and small improvements. Model usage, hosting, and other third-party costs are separate and discussed before the build. New workflows are quoted separately.",
  },
];
