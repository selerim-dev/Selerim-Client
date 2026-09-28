# Logistics local acceptance — 2026-09-28

Scope: fictional seed-42 fixture, actual pypdf extraction, exact-ID matching,
deterministic gap rules and template drafting. No real email, live LLM run,
OCR, hosting or Loom recording is represented by these results.

| Check | Observed result |
| --- | --- |
| Clean document matching | 30 / 30 |
| Document findings | 11 / 11, no extra findings |
| Missing-document gaps | 65 / 65, no extra gaps |
| Classification / matching | No incorrect rows across 40 documents |
| Extracted fixture fields | Exact match to expected values |
| Held-out job | Pass with training inputs absent |
| Initial pending drafts | 38 |
| Outbox before human approval | 0 |
| Send before approval / after rejection | Rejected |
| Repeated send | One outbox record |
| Changed evidence after approval | Approval invalidated; send rejected |
| Audit chain | Valid; update/delete triggers enforced |
| Cross-job and path traversal | Rejected |
| Invalid action token / external Origin / Host | HTTP 403 |
| Full automated suite | 20 tests pass |

Browser verification exercised approve → send → fake outbox and checked rendered
source links and document findings. The displayed outbox now contains one clearly
marked simulated send from that browser check. Use a fresh state path to start
with an empty queue/outbox for recording.

Reproduce via the commands in README.md. The score is a result on a deliberately
specified synthetic fixture, not a production generalization or client outcome.
The OpenAI adapter is covered by mocked API tests only. Its generated wording
and live provider behavior remain unverified until configured and exercised.
