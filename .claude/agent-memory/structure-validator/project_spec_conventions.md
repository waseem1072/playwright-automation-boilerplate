---
name: Spec File Conventions — Confirmed Patterns
description: All spec files use storageState override, array-form screenshots, and consistent tag sets
type: project
---

Confirmed conventions across all spec files in `src/tests/ts/`:

1. **storageState override** — every spec file includes `test.use({ storageState: { cookies: [], origins: [] } })` at describe-block level to bypass global storage state.

2. **Screenshot array form** — all `toHaveScreenshot` calls use the two-element array form:
   `await expect(page).toHaveScreenshot(['<PageObjectClassName>', '<description>.png']);`
   The first element must match the page object class name exactly (used as snapshot subfolder name).

3. **Tags** — dual-tagging in both describe title string AND `{ tag: [...] }` option:
   - `@docs` on all tests (domain marker)
   - `@smoke` for smoke suite (playwrightDocs.smoke.spec.ts, getStarted.spec.ts, webServer.spec.ts)
   - `@regression` for full journey suite (e2e.spec.ts only — this file does NOT use @smoke)
   - `@boundary` for boundary suite (boundaryValue.spec.ts) — tests within carry mixed `@smoke`/`@regression` tags alongside `@boundary` and `@positive`
   - `@positive` on all happy-path tests; `@negative` expected for negative cases (not yet present)
   - boundaryValue.spec.ts intentionally carries both `@boundary` and a secondary run-level tag (`@smoke` or `@regression`) per test

4. **Import paths** — `../../pages/<name>.page` (relative, no `.ts` extension)

5. **Spec naming**:
   - `playwrightDocs.smoke.spec.ts` — `<featureName>.<tag>.spec.ts` pattern
   - `getStarted.spec.ts`, `webServer.spec.ts`, `e2e.spec.ts` — `<featureName>.spec.ts` pattern
   - All files are camelCase

**How to apply:** Generated spec files must include all five conventions above. Failing to include storageState override will cause tests to inherit the global storage state (which has no backing file) and may fail.
