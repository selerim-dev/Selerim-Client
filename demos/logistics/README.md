# Shipment document agent — synthetic dataset v1

Working local logistics demo: fixture generation, read-only folder ingestion,
PDF extraction, matching, gap checks, approval queue, fake outbox and audit log.
OpenAI drafting is optional and requires an explicitly configured API key/model;
the verified baseline uses offline templates. No hosted deployment or recording
has been published. Every record remains fictional.

## Run

Python 3.9+; the generator needs only the standard library. The agent needs pypdf:

```sh
cd demos/logistics
python3 -m pip install -r requirements.txt
python3 -m selerim_demo.generate --output generated/seed-42 --seed 42
python3 -m unittest discover -s tests -v
```

Existing output paths are rejected without modification. Use a new directory to
regenerate. Same seed produces identical bytes on the same Python/SQLite runtime.
Every input is SHA-256 hashed in `manifest.json`. Generated fixtures are ignored
by Git and reproducible from committed source.

## Dataset

- `inputs/records.sqlite` and `inputs/shipments.json`: 50 fictional delivered
  shipments; every shipment requires a BOL and POD by the fixed job date.
- `inputs/documents/`: 40 PDFs. 36 original documents for 18 shipments, two
  unknown-reference documents, one exact duplicate, one truncated PDF. Readable
  PDFs have text operators and a prominent synthetic label. No OCR/scanned
  documents yet; OCR accuracy is not established by these fixtures.
- `inputs/inbox.json`: deterministic arrival events and attachment paths,
  with no answer labels. All addresses use the non-deliverable `.invalid` domain.
- `inputs/job.json`: job ID, as-of date, requirements, matching/send policies.
- `evaluation/expected.json`: private answer key for document matches, extracted
  fields, classifications, defects, duplicate identity and shipment-level gaps.
- `evaluation/split.json`: 40 training / 10 held-out shipments. Documents for the
  same shipment stay together, including duplicates and the missing-ID document.
  Unknown-reference and unreadable cases are held-out robustness cases.

Only mount `inputs/` into the future agent's job. Do not expose `evaluation/`
to the agent or include it in prompts. An evaluation runner must filter shipment
rows and attachments into separate jobs for each split before running the agent.
Split membership is not an input label.

## Exact planted cases

| Case | Fixture | Expected finding |
| --- | --- | --- |
| Wrong piece count | DOC-005 | mismatch:pieces |
| Wrong carrier | DOC-010 | mismatch:carrier |
| Wrong weight | DOC-015 | mismatch:weight_lb |
| Missing recipient | DOC-020 | missing_field:received_by |
| Missing carrier | DOC-023 | missing_field:carrier |
| Missing shipment ID | DOC-030 | missing_field:shipment_id + unmatched |
| Unknown reference | DOC-037, DOC-038 | unmatched |
| Duplicate DOC-001 | DOC-039 | duplicate |
| Truncated PDF | DOC-040 | unreadable |
| Neither document received | Shipments 0019–0050 | BOL and POD missing |
| POD cannot be linked | Shipment 0015 | POD missing |

Totals: **30 clean documents, 11 document findings, 65 missing-document gaps**.
The gap count is intentional: 100 required document slots minus 35 linkable
original documents. A known document with a field defect is present but defective,
not also absent. Missing/unknown IDs require review rather than guessed matches.
Duplicates link to the original shipment but cannot fill additional slots.

## Acceptance scorer

Agent predictions are JSON with `documents` rows containing `document_id`,
`type` (`BOL`, `POD`, null for unreadable), `shipment_id` (nullable), and `findings`
(list of stable codes above). Include `missing_documents` rows containing
`shipment_id` and `document_type`. Every selected document must appear once.

```sh
python3 -m selerim_demo.evaluate \
  --expected generated/seed-42/evaluation/expected.json \
  --predictions agent-results.json --split all
```

Exit 0 requires exact matching/classification, all findings and shipment gaps,
and no false positives. `--split train` or `--split heldout` expects only results
for that split. Negative controls test wrong matches/types, missed/extra findings,
missed/extra gaps and duplicate prediction IDs. Oracle replay verifies scoring
logic only; it is **not measured agent accuracy**. Field-level extraction metrics
can use `expected_fields` when the parser/agent is implemented.

## Run the approval UI

```sh
python3 -m selerim_demo.server \
  --inputs generated/seed-42/inputs \
  --state generated/runtime/demo.sqlite --port 8091
```

Open http://127.0.0.1:8091. The watcher checks the synthetic inbox manifest every
two seconds; refresh the page to see updates. Use `--no-watch` for a manual
walkthrough. Failures pause the watcher to prevent automatic LLM retries/costs;
resolve the issue and click Check inbox folder to resume. State persists across
restarts. Use a new state path for a fresh demo; no destructive reset endpoint.

For optional OpenAI wording, securely configure `OPENAI_API_KEY` in the process
environment and add `--llm-model YOUR_MODEL_ID` with a new state path. Only the
synthetic shipment ID and issue list are transmitted, with `store: false`. This
setting is not a blanket zero-retention guarantee. No tools or sending powers
are provided to the model. Provider errors remain failures; there is no silent
fallback that pretends to be AI. Existing drafts are not regenerated on refresh.
API integration tests use a mock provider; a live provider run remains pending.
API reference: https://developers.openai.com/api/docs/guides/text

## Batch acceptance

```sh
python3 -m selerim_demo.run --inputs generated/seed-42/inputs \
  --state generated/acceptance/state.sqlite \
  --output generated/acceptance/predictions.json
python3 -m selerim_demo.evaluate \
  --expected generated/seed-42/evaluation/expected.json \
  --predictions generated/acceptance/predictions.json
```

The engine never opens the oracle. The actual parser run passed 30/30 clean
matches, all 11 findings, all 65 gaps, and no false positives. Field extraction
matches fixture values exactly. A separate held-out job is tested with training
records and documents physically absent. These are synthetic fixture results,
not general production/OCR/LLM accuracy claims.

## Security and boundaries

- Read-only SQLite source connection; runtime state lives outside inputs.
- Job-ID checks, path/symlink rejection, fixed record/config snapshot, append-only
  inbox events and immutable ingested document bytes.
- Human approval and sending are separate, server-enforced state transitions.
  Rejection blocks sends; new evidence invalidates approvals; retries are
  idempotent. Only `.invalid` demo recipients may enter the fake outbox.
- Business actions include job/document/draft-linked audit events. Database
  triggers reject audit updates/deletes, and the chained hashes are verifiable.
  A database owner can still defeat these controls; this is not remote immutable
  storage or a compliance certification.
- Loopback binding, Host/Origin checks, per-run action token, escaped HTML and
  restrictive browser headers. This is a single-operator local demo, not a
  production authenticated service or OS sandbox. Do not expose its port through
  a public tunnel; deployment needs authentication and job isolation first.
- No real inbox account or SMTP/API mail transport is connected. Scanned PDFs
  and unsupported/corrupt documents go to review; no OCR claim is made.

See WALKTHROUGH.md for the recording script and POST-DRAFT.md for an unpublished
post. Hosting, real LLM configuration, Loom recording, legal demo and site embeds
remain later shipping steps.
