---
name: Project Structure — Confirmed Layout
description: Verified directory layout as of 2026-04-07 after migration to src/tests/ts/ for spec files
type: project
---

The project has migrated spec files from `src/tests/` root to `src/tests/ts/`. This is the confirmed live layout:

```
src/
  pages/
    playwrightHome.page.ts
    playwrightDocs.page.ts
    playwrightCommunity.page.ts      # new — added alongside e2e.spec.ts
  tests/
    ts/                              # all .spec.ts files live here (not at root of src/tests/)
      playwrightDocs.smoke.spec.ts
      getStarted.spec.ts
      e2e.spec.ts                    # regression suite, @regression tag
      webServer.spec.ts
      <spec>.spec.ts-snapshots/      # snapshot folders co-located with specs in ts/
    yml/
      homepage-loads.yml
      nav-docs.yml
      nav-api.yml
      nav-community.yml
      get-started-happy-path.yml
      docs-writing-tests.yml
      docs-web-server.yml
      web-server-happy-path.yml
    resources/
      locators.json                  # shared locator reference — not imported by specs directly
```

**Why:** testDir in playwright.config.ts is `./src/tests/ts` — specs must live there or they are invisible to Playwright.

**How to apply:** When generating new spec files, always place them in `src/tests/ts/`, never at `src/tests/` root.
