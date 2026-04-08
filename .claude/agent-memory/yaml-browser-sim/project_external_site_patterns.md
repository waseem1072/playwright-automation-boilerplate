---
name: External site YAML simulation patterns
description: Confirmed selectors and schema workarounds for playwright.dev flows, and notes on title assertion approximation
type: project
---

YAML simulations are not limited to saucedemo.com — the user also requests scripts for external sites (e.g. playwright.dev).

**Why:** The YAML schema is generic and the user treats it as a universal browser simulation spec, not project-scoped.

**How to apply:** When generating YAML for any site, apply the same schema and quality gates. Do not assume saucedemo selectors apply.

## Confirmed stable selectors — playwright.dev

- "Get started" link: `role=link[name='Get started']` (ARIA role + name; single match on homepage as of 2026-03-31)
- Installation heading: `role=heading[name='Installation']` on `/docs/intro`
- Expected post-click URL: `https://playwright.dev/docs/intro`
- Expected page title: `Installation | Playwright`

### Search flow (confirmed 2026-03-31)

- Search trigger button (navbar): `[placeholder='Search docs']` — opens the Algolia/DocSearch modal
- Search input inside modal: `[role='searchbox'][name='Search']`
- First result for "page object model": `[role='option'][aria-label='Page object models']`
- Expected post-click URL: `https://playwright.dev/docs/pom`
- Expected page title: `Page object models | Playwright`
- Expected heading: `role=heading[name='Page object models']`

### Docs sidebar navigation pattern (confirmed 2026-03-31)

- Sidebar links use ARIA role: `role=link[name='<Page Name>']`
- Always add `# REVIEW:` — sidebar renders many links and duplicates are possible; `.first()` may be needed
- After sidebar click, assert all three: `type: url` (exact), `type: visible` on `role=heading[name='...'][level=1]`, and `type: text` on `title` (see schema limitation below)
- Confirmed flows: Writing tests → `/docs/writing-tests`, Web server → `/docs/test-webserver`
- Installation heading on `/docs/intro`: `role=heading[name='Installation']` — assert as `visible` in the `goto` step itself (precondition guard)

## Schema limitation: no assert_title action

The YAML schema has no `assert_title` action. Workaround: `assert_text` on `selector: title`. However, when handing off to `playwright-ts-generator`, always note that this must be translated to `expect(page).toHaveTitle(...)` — NOT a locator-based text check, as `<title>` is not a visible element.

## Boundary-value test patterns (confirmed 2026-04-07)

### Language selector — two-step, scoped selector pattern
- Step 1: click `role=button[name='Node.js']` to open dropdown
- Step 2: click `nav[aria-label='Main'] role=link[name='<Language>']` scoped to the main nav
- Python URL assertion: `contains: /python/`
- .NET URL assertion: `contains: /dotnet/` — link name is `role=link[name='.NET']` (not in locators.json; assumed from site conventions)
- Confirmed selector for Node.js button: `role=button[name='Node.js']`

### Search modal — value assertions
- Open modal: click `role=button[name=/Search/]`
- Empty boundary (TC-008): assert `type: value` with `expected: ""` — TS generator uses `expect(locator).toHaveValue('')`
- 100-char boundary (TC-009): fill with `'a'.repeat(100)` then assert `type: value` with the exact string — TS generator uses `expect(locator).toHaveValue(query)` where `query = 'a'.repeat(100)`

### Dark mode toggle — attribute-based assertions
- Toggle selector: `role=button[name=/Switch between dark and light mode/]` (name does NOT change between states)
- Dark mode active: `html[data-theme='dark']` → TS generator: `expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')`
- Light mode (no dark): `html:not([data-theme='dark'])` → TS generator: `expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark')`
- YAML `type: visible` on a CSS attribute selector is a workaround — always flag with `# REVIEW:` and add TS generator note
- Initial state is light mode when storage state is empty (no cookies, no origins)

### Docs sidebar — confirmed additional flows (2026-04-07)
- Writing tests → `/docs/writing-tests` (first-link boundary): `role=link[name='Writing tests']`
- Annotations → `/docs/test-annotations` (deep-link boundary): `role=link[name='Annotations']`
- Both: assert `type: url` (exact for Writing tests, `contains` for Annotations) + `type: visible` on heading
- Always add `# REVIEW:` for sidebar links — `.first()` may be needed in TS generator
