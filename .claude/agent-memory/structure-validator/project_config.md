---
name: Playwright Config — Confirmed Settings
description: playwright.config.ts key settings as of 2026-04-07 (post-boilerplate migration)
type: project
---

Confirmed settings in `playwright.config.ts`:

- `testDir`: `./src/tests` — broad; picks up specs from both `src/tests/ts/` and any future subdirs
- `testMatch`: includes `**/hrms.spec.ts`, `**/employee.approval.spec.ts`, `**/*.spec.ts` — the first two entries are stale (those files were deleted); only `**/*.spec.ts` is effective
- `baseURL`: `https://playwright.dev/`
- `fullyParallel`: `false`
- `reporter`: `[["html"], ["./src/reporters/teamsReporter.ts"]]` — teamsReporter reads `TEAMS_WEBHOOK_URL` and `SEND_TEAMS_REPORT` from env; skips silently if either is unset. Path resolves to `src/reporters/teamsReporter.ts`
- `screenshot`: `'only-on-failure'`
- `video`: `'retain-on-failure'`
- `trace`: `'on-first-retry'`
- `retries`: `1` on both CI and local (same value — no differentiation)
- `workers`: CI=1, local=undefined
- `actionTimeout`: 550000 ms (comment says 40s — actual value is ~9 min, mismatch)
- `navigationTimeout`: 950000 ms (comment says 80s — actual value is ~16 min, mismatch)
- Projects: `chromium` only — no `setup` project declared

**Known deviations:**
- `testMatch` contains two stale entries (`hrms.spec.ts`, `employee.approval.spec.ts`) referencing deleted regression spec files. They are harmless but misleading.
- Timeout values are vastly larger than the comments describe — comments say 40s/80s but config values are 550000/950000 ms (~9 min/~16 min). Likely copy-paste error.
- `teamsReporter.ts` correctly reads `TEAMS_WEBHOOK_URL` and `SEND_TEAMS_REPORT` from env vars. Also supports optional `SHOW_HTML_REPORT_BUTTON` and `PLAYWRIGHT_REPORT_URL` for adding a report link button to the card.

**How to apply:** When changing config, do not revert `testDir` to `./src/tests/ts`. The setup project block is gone — do not add it back unless explicitly asked.
