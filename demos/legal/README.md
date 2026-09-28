# The matter room — Selerim legal intake concept

An original evidence-led reading workspace for fictional commercial intake. The
brief sits beside its source material; every factual summary sentence links to
an exact document, page and line. Incomplete matters enter a separate queue.
Human review and local filing are distinct, server-enforced actions.

**This is a local concept build, not client work.** It organizes submitted facts;
it provides no legal advice, conflict clearance, deadline calculation, engagement
validation or autonomous client acceptance. No external email or LLM is connected.
The deterministic parser is the measured baseline; do not present these results
as LLM or production-document accuracy.

## Run from the repository root

Python 3.9+, with the logistics demo's `pypdf` dependency:

```sh
python3 -m pip install -r demos/logistics/requirements.txt
python3 -m demos.legal.legal_demo.generate --output demos/legal/generated/seed-73
python3 -m demos.legal.legal_demo.server \
  --inputs demos/legal/generated/seed-73/inputs \
  --state demos/legal/generated/runtime/demo.sqlite --port 8092
```

Open http://127.0.0.1:8092. Fixture generation refuses existing output paths.
The server processes the initial inbox and checks for new matters when the
operator clicks **Check intake inbox**. It does not connect to a real inbox or
poll a mail account. Use a fresh state path for a fresh demonstration.

## Dataset and acceptance

- 30 fictional emails, 30 intake forms, 26 engagement letters.
- 18 complete matters and 12 deliberately incomplete matters: four missing
  letters, three missing contact emails, three unsigned letters and two company
  conflicts. Fictional contacts use non-deliverable `.invalid` addresses.
- 20 training / 10 held-out matters. Held-out forms use alternate supported
  headings and shuffled field order. The evaluation runner physically copies
  only the selected split into each job, keeping answer labels outside inputs.
- Text PDFs only. Unsupported, ambiguous and foreign-matter documents go to
  review; no OCR, handwriting or general legal-document accuracy claim.

```sh
python3 -m unittest discover -s demos/legal/tests -v
python3 -m demos.legal.legal_demo.evaluate \
  --dataset demos/legal/generated/seed-73 \
  --output demos/legal/generated/acceptance-01
```

Use a new output directory for each evaluation. See [ACCEPTANCE.md](ACCEPTANCE.md)
for the measured results and their limits.

## Interaction and design

The Selerim typography, lavender identity, icons, command menu, keyboard behavior,
and approval-form patterns are reused from the logistics workspace. This concept
adds an editorial brief, numbered facts, page/line citations, a warm paper source
reader, and a distinct completeness check. No stock legal imagery or ornamental
scales of justice. The working interaction is the visual centerpiece.

- Select a cited statement to highlight the exact extracted line.
- Switch between the original intake form, engagement letter and email.
- Filter incomplete or filed matters; search by company or matter ID.
- Cmd/Ctrl+K opens navigation; J/K moves through matters; / focuses search.
- On mobile the brief precedes the source reader. All actions work without JS.
- Motion respects the device's reduced-motion preference.

The source reader shows **extracted text**, not a rendered facsimile. Open original
loads the actual PDF or email. All fonts and scripts are served locally.

## Security and data handling

- Files are read only within the selected matter's directory. Symlink, traversal,
  duplicate-ID, foreign-reference and changed-source checks fail closed.
- Every source is SHA-256 hashed. Changed evidence blocks approval/finalization;
  corrected materials require a fresh job/state database and renewed review.
- Runtime SQLite stores allowlisted extracted facts, citations, hashes and review
  metadata. It does not copy raw PDF or email bodies; originals remain in inputs.
  There is no automatic deletion timer. Both input and state directories remain
  until the operator removes them after the demo.
- Incomplete matters cannot be approved or finalized. Complete matters require
  explicit source-review attestation before approval; filing is a separate action.
  The local demo operator is not an authenticated or verified attorney identity.
- Decisions and source views have append-only, hash-chained local audit records.
  A database owner can circumvent these controls; this is not an independently
  immutable archive, certification or production compliance guarantee.
- Loopback binding, Host/Origin checks, per-run form tokens, escaped output and a
  restrictive CSP. No public tunnel or unauthenticated production exposure.

Hosted authentication, live-model evaluation, Loom recordings and public embeds
remain shipping steps. WALKTHROUGH.md and POST-DRAFT.md prepare those assets;
they do not claim a recording or post has been published.
