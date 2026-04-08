---
name: Stray Root Artifacts — Recurring Issue
description: Non-standard files accumulate at project root during debugging and pipeline runs; must be cleaned up
type: project
---

As of 2026-04-07, the following stray files exist at the project root:

- `test-teams-webhook.ts` — one-off webhook debug script; not part of the test suite, not compiled, not referenced anywhere
- `test-webhook.js` — JavaScript equivalent of the above; stray
- `test_error.log` — runtime error log artifact; should be .gitignored
- `test-output.txt` — runtime output artifact; should be .gitignored
- `Professional QA Automation Code Review Prompt.md` — prompt/notes file; not a project artifact

**Previous pipeline artifacts (now cleared):** community-welcome.yaml, writing-tests-page.yaml, get-started-verified.png, AGENT_PIPELINE_TEMPLATE.md were present in earlier sessions but are now gone.

**Why:** These accumulate during debugging and CI triage sessions. The yaml-browser-sim agent previously wrote intermediate YAML to cwd (project root).

**How to apply:** After any pipeline run or debugging session, check the project root for stray `.ts`, `.js`, `.log`, `.txt`, `.yaml`, `.yml`, and `.png` files and flag them. `test-teams-webhook.ts` and `test-webhook.js` are structurally the most disruptive (non-config TS/JS at root).
