# Measured acceptance — seed 73

Actual engine run, 2026-09-28. The engine reads only isolated `inputs/` and never
opens evaluation labels. The scorer reads the labels separately.

| Check | Training | Held-out |
| --- | ---: | ---: |
| Matters | 20 | 10 |
| Document classifications | 38/38 | 18/18 |
| Extracted fields | 211/211 | 100/100 |
| Source-linked summary statements | 118/118 | 58/58 |
| Exact issue sets and routing | 20/20 | 10/10 |
| Audit hash chain | Verified | Verified |

Across the full dataset, all 12 incomplete matters are flagged with their exact
planted issue; all 18 complete matters route to attorney review.

All 13 tests pass. The test suite also opens every cited PDF and verifies the quoted page/line and
that the extracted value occurs in the summary sentence. Negative controls
reject wrong classifications, wrong fields, wrong routes, removed citations and
missing summaries. Review tests block premature finalization, block incomplete
approval, require HTTP review attestation, verify idempotent filing and block
changed sources after approval. Scope tests reject cross-matter paths, symlinks
and foreign matter references. HTTP tests check Host, Origin, token, escaping and
asset traversal. Database tests enforce append-only events and minimal retention.

These results describe deterministic text extraction on generated fixtures.
They do not establish accuracy on scanned PDFs, arbitrary legal documents,
handwriting, LLM-generated summaries, legal analysis or real client intake.
