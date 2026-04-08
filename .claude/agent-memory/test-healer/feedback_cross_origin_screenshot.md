---
name: Cross-origin sub-site screenshot font timeout
description: playwright.dev sub-sites (/python/, /java/, /dotnet/) need waitForLoadState('networkidle') + extended toHaveScreenshot timeout to avoid font-load timeout failures
type: feedback
---

playwright.dev language sub-sites (/python/, /java/, /dotnet/) load CDN fonts that exceed the default 5 s font-wait inside `toHaveScreenshot`, causing "Timeout 5000ms exceeded" during `--update-snapshots`. URL/title assertions always pass; only screenshot capture times out.

**Why:** These are cross-origin sub-sites with independent font CDN loads. The main playwright.dev domain does not exhibit this behaviour.

**How to apply:** The fix belongs in the **page object method** that navigates to the sub-site (e.g. `selectLanguage()` in `playwrightHome.page.ts`), not in individual spec files. Add `await this.page.waitForLoadState('networkidle')` at the end of the navigation method so all callers benefit without needing to know about the sub-site font issue. Do not use `waitForTimeout`. Do not pass `{ timeout: 15000 }` to `toHaveScreenshot` — fixing the root cause in the page object makes that unnecessary.
