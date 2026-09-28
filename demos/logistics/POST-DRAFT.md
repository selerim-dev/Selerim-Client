# Logistics concept post — draft, not published

Shipment paperwork is easy to receive and surprisingly expensive to reconcile.

I built a logistics concept that reads a scoped document folder, matches BOLs and
PODs to shipment records, flags missing or inconsistent information, and queues
follow-ups for human approval.

The controls matter as much as the workflow: read-only source access, job-scoped
records, an append-only activity log, and no send before approval. The demo uses
fictional data and a local fake outbox; it sends no real email. The verified
baseline uses deterministic parsing and template drafts. Optional LLM wording
still goes through the same approval gate.

On its synthetic fixture: 30/30 clean-document matches, all 11 document findings
and 65 missing-document gaps detected, with no false positives. These are
fixture results, not client outcomes or a production accuracy claim.

Walkthrough: [add the reviewed recording link before publishing]
