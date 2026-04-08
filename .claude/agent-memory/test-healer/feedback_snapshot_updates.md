---
name: Snapshot baseline regeneration protocol
description: When site content changes cause screenshot diffs, always fix text/locator assertions first, then regenerate baselines with --update-snapshots in headless mode
type: feedback
---

When screenshot diffs are caused by site content changes (not test logic bugs), the fix is:
1. First correct any related text/assertion failures in the same pass.
2. Run `npx playwright test <spec> --update-snapshots` in headless mode (the default — never headed).
3. Verify with a clean `npx playwright test --grep @smoke` run.

**Why:** Regenerating snapshots while a text assertion is still broken will capture a passing screenshot over a page that will fail on the next run. Always fix assertions before regenerating. Headed mode captures a different viewport resolution, causing immediate false failures on the next CI run.

**How to apply:** Treat any smoke run with >20% pixel diff as a stale baseline signal. Check whether a site content change (hero heading, layout) caused the diff before assuming a test logic bug. If content changed, fix assertions first, then regenerate.
