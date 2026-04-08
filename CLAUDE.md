# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Playwright/TypeScript E2E test suite targeting `https://playwright.dev/` — covering homepage, docs, API, and community pages. Tests run against the live site (no local dev server).

- **Base URL:** `https://playwright.dev/`
- **Browser:** Chromium only (Desktop Chrome)
- **Author:** Waseem Nooruddin

## Commands

```bash
npm test                          # Run all Playwright tests (headless)
npm run test-ui                   # Run with Playwright UI mode
npm run test-headed               # Run in headed (visible browser) mode
npm run report                    # Open latest HTML report

# Run a single spec file
npx playwright test src/tests/ts/playwrightDocs.smoke.spec.ts

# Run tests by tag
npx playwright test --grep @smoke
npx playwright test --grep @regression
npx playwright test --grep @boundary

# Run a single test by title
npx playwright test --grep "homepage loads"

# Update screenshot baselines
npx playwright test --update-snapshots

# Run with trace for debugging
npx playwright test --trace on
```

## Architecture

### Page Object Model (POM)

All UI interactions live in `src/pages/`. Three page classes:

- `PlaywrightHomePage` — homepage navigation, language selector, search, dark mode toggle
- `PlaywrightDocsPage` — docs/installation/sidebar navigation, heading getters
- `PlaywrightCommunityPage` — community page navigation and link assertions

Each class accepts `Page` in the constructor and exposes action methods and getter properties. Tests compose these — never write raw locator calls in spec files.

### Test Organization

Specs live in `src/tests/ts/`:

| File | Tag | Coverage |
|------|-----|----------|
| `playwrightDocs.smoke.spec.ts` | `@smoke` | Homepage, nav, hero CTA, logo, language selector, search, dark mode, docs sidebar |
| `e2e.spec.ts` | `@regression` | Full multi-step user journeys across all three pages |
| `boundaryValue.spec.ts` | `@boundary` | Edge cases: empty search, max-length input, dark mode toggle, language variants |
| `getStarted.spec.ts` | `@smoke` | Installation page and UI Mode page |
| `webServer.spec.ts` | `@smoke` | Web server docs page |

All tests include `test.use({ storageState: { cookies: [], origins: [] } })` to enforce a clean browser state. Every test carries both a suite tag (`@docs`) and polarity tags (`@positive`/`@negative`).

### Screenshot Conventions

Snapshots use the array form and are namespaced by page object class:

```ts
await expect(page).toHaveScreenshot(['playwrightHome', 'description.png']);
await expect(page).toHaveScreenshot(['playwrightDocs', 'description.png']);
await expect(page).toHaveScreenshot(['playwrightCommunity', 'description.png']);
```

Snapshots are stored alongside their spec in `<spec-name>-snapshots/<PageClass>/`. When tests against the live site produce minor pixel drift, add `{ maxDiffPixelRatio: 0.02 }` rather than updating baselines unnecessarily. For language sub-sites (`/python/`, `/java/`, `/dotnet/`) always call `await page.waitForLoadState('networkidle')` before screenshotting — cross-origin font loading causes timeouts.

### Locator Reference

`src/tests/resources/locators.json` documents the stable selectors and known fragile areas (e.g. the hero heading changed in 2026-04 — always assert only the stable prefix `'Playwright enables reliable'`, never the full string).

### YAML Specs

`src/tests/yml/` contains human-readable browser-action descriptions of the same scenarios. These are documentation artifacts for code generation — they are not executed by Playwright directly.

### Custom Teams Reporter

`src/reporters/teamsReporter.ts` implements the Playwright `Reporter` interface. It sends an Adaptive Card to MS Teams on run completion. Retry detection: a test that fails then passes is counted as **flaky**, not passed.

| Variable | Purpose |
|---|---|
| `TEAMS_WEBHOOK_URL` | MS Teams incoming webhook URL |
| `SEND_TEAMS_REPORT` | Set to `true` to enable posting |

Copy `.env.example` to `.env` and populate before running locally. The reporter skips silently if either variable is unset.

### CI/CD

GitHub Actions workflow (`.github/workflows/playwright.yml`) runs on push to main, PRs, and on schedule. Runs with 1 worker (sequential) on Chromium. Screenshots and video captured on failure; trace on first retry.

## Known Issues

- `playwright.config.ts` `retries` is hardcoded to `1` for both CI and local — local runs retry once (by design or oversight).
- `actionTimeout` / `navigationTimeout` values in config are much larger than the comments indicate.
- `testMatch` contains two stale entries for deleted spec files (`hrms.spec.ts`, `employee.approval.spec.ts`) — harmless but misleading.
