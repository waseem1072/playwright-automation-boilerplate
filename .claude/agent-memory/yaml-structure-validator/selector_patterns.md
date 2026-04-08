---
name: Selector Patterns and Anti-Patterns
description: Recurring selector patterns observed in project YAML files — stable patterns and known anti-patterns
type: project
---

## Stable Selector Patterns Observed

All nav selectors use ARIA role + name, which map directly to page object methods:
- `role=link[name='Docs']` → `playwrightHome.page.ts` `clickDocsNav()`
- `role=link[name='API']` → `playwrightHome.page.ts` `clickApiNav()`
- `role=link[name='Community']` → `playwrightHome.page.ts` `clickCommunityNav()`
- `role=link[name='Get started']` → `playwrightHome.page.ts` `clickGetStarted()` (uses `.first()` because two exist on page)
- `role=link[name='Writing tests']` → `playwrightDocs.page.ts` `clickSidebarLink('Writing tests')` (uses `.first()`)
- `role=link[name='Web server']` → `playwrightDocs.page.ts` `clickSidebarLink('Web server')` (uses `.first()`)

## Known Anti-Patterns

1. **Ambiguous multi-match selectors without `.first()` hint**: `role=link[name='Get started']` and sidebar links like `role=link[name='Writing tests']` both match multiple elements. YAML files use inline `# REVIEW` comments to flag this but these are not machine-readable. The generator must emit `.first()` for these — currently handled by the page object methods but not encoded in the YAML.

2. **`selector: title` for document title assertions**: Seen in `web-server-happy-path.yml` line 35. The `<title>` DOM element is not a visible locator — Playwright uses `expect(page).toHaveTitle()` for this. The YAML must use a different assertion type (e.g., a project-specific `type: title`) rather than `type: text` with `selector: title`.

3. **`role=heading[name='...'][level=1]` attribute syntax**: The `[level=1]` qualifier in ARIA locator strings is not valid Playwright locator syntax. Playwright uses `{ level: 1 }` as a separate option. YAML files using this syntax require the generator to parse and transform it — seen in `web-server-happy-path.yml`.

4. **Overly long heading name in selector**: `role=heading[name='Playwright enables reliable end-to-end testing for modern web apps.']` — tightly coupled to exact marketing copy. Prefer `role=heading[level=1]` with a `contains` text check.
