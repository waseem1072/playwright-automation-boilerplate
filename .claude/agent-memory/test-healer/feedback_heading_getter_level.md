---
name: Heading getter must always include level:1
description: All page-heading getters in PlaywrightDocsPage must use level:1 to avoid matching sidebar/breadcrumb heading-role elements on the SPA
type: feedback
---

Always include `level: 1` in every `getByRole('heading', ...)` call used as a page-heading getter in `playwrightDocs.page.ts` (and any future docs page objects).

**Why:** playwright.dev is a SPA. The active sidebar section and breadcrumb components render ARIA heading-role elements that share the same text as the page h1 (e.g., "UI Mode"). Without `level: 1`, Playwright resolves the first DOM-order match, which is often off-screen, causing `toBeVisible()` to time out even though the page loaded correctly. This was confirmed when `uiModeHeading` failed with a 5000 ms timeout despite the live h1 still reading "UI Mode".

**How to apply:** Any time a new heading getter is added to a docs page object, or an existing one is reviewed, verify it has `level: 1`. Flag any getter that uses only `{ name: '...', exact: true }` without a level constraint — it is fragile on this SPA.
