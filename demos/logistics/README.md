# Shipment document agent — synthetic dataset v1

First milestone only: generator, fixtures and deterministic scorer. The agent,
approval queue, runtime audit log, hosted demos, recordings and site embeds are
not implemented by this milestone. No network, API keys or paid services used.

## Run

Python 3.9+ standard library, no installation needed:

```sh
cd demos/logistics
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

## Next

Implement a read-only job-scoped folder watcher, PDF extraction, matching, gap
checks, drafting and the approval queue. Every action needs a linked audit event.
A local fake outbox must enforce explicit human approval and idempotent sends.
No real outbound delivery is required for the fictional walkthrough. This
fixture generator has no send capability and makes no claim that those runtime
security controls have been implemented or verified. Reuse the queue for the
legal demo after logistics passes its full acceptance checks.
