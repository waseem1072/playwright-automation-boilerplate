---
name: Hero heading assertion strategy
description: Do not assert on playwright.dev hero heading verbatim — use the stable prefix "Playwright enables reliable" to survive future copy changes
type: feedback
---

Assert only the stable invariant prefix of the playwright.dev hero heading, not the full marketing copy.

**Why:** The hero h1 changed from "Playwright enables reliable end-to-end testing" to "Playwright enables reliable web automation for testing, scripting, and AI agents." in early 2026. Full-string assertions break on every marketing copy update.

**How to apply:** Use `toContainText('Playwright enables reliable')` — the prefix is stable. The canonical value lives in `locators.json` under `locators.hero.headingPartialMatch`. Never hardcode the full heading in a spec.
