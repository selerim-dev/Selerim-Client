# Logistics concept walkthrough — 3–5 minute recording plan

Record only the synthetic demo browser window. This is a script, not a completed
Loom recording. The current verified run uses offline templates; disclose that.
If recording with OpenAI enabled, first validate that real provider run and use
its actual audit evidence. Do not claim measured labor savings or client work.

## 0:00–0:35 — Problem and scope

“Shipment paperwork lands in different places. Matching documents and chasing
missing information consumes operations time. This concept uses 50 fictional
shipments and 40 synthetic PDFs. Nothing here is client data.”

Show the demo banner and input directory. Explain that the folder represents a
read-only scoped inbox. This is not a live Gmail or Microsoft 365 connection.

## 0:35–1:25 — Arrival, parsing and matching

Start a fresh state database with `--no-watch`. The queue starts empty. Click
Check inbox folder. Open DOC-005 for shipment SYN-SHP-0003; show the piece-count
mismatch. Explain deterministic PDF extraction and exact-ID matching. Scanned
or unreadable documents require manual review; OCR is not enabled.

The normal server mode polls the synthetic inbox manifest every two seconds.
For a staged arrival, append a synthetic event and its PDF to a separate fixture
copy. Existing events and document bytes cannot be silently replaced.

## 1:25–2:15 — Gaps and draft

Show the shipment's pending draft and PDF links. It requests corrected documents
and shows exactly what the operator would send. “The current offline mode uses a
template. Optional LLM drafting can change wording, but cannot approve or send.”

Show DOC-030's missing ID and DOC-040's unreadable file in Document review.
They are routed for investigation rather than guessed into a shipment.

## 2:15–3:00 — Human control

Point out that the pending draft has no send button. Click Approve draft.
Now click Send to local fake outbox. Show the outbox record and explicitly state
that it is simulated: no email was delivered. Duplicate send requests cannot
create a second outbox record. Changed document evidence invalidates approvals.

## 3:00–4:00 — Audit evidence and results

Expand Activity log. Show document_received → document_parsed → document_matched
→ document_flagged → draft_queued → human_approved → fake_outbox_written.
Explain timestamps, job scope and the hash chain. This is a local append-only
log with hash verification, not an independently secured compliance archive.

Show the generated acceptance score: 30/30 clean matches, 11/11 findings,
65/65 shipment gaps, no false positives on this fixture. State that these are
synthetic test results, not production accuracy or measured time savings.

## 4:00–4:20 — Closing

“The useful workflow is documents in, exceptions surfaced, and a person in
control of what goes out. A real engagement starts by checking your data,
permissions, and acceptance criteria through the AI Opportunity Audit.”

## Shipping asset

The website embeds a captioned, music-only product tour built from captured application states.
This is not a continuous live recording or a Loom upload. See `../media/README.md`.
