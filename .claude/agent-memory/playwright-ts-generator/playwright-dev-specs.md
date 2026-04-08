---
name: Playwright.dev External Spec Patterns
description: Conventions for specs targeting playwright.dev (not saucedemo) — auth bypass, page object structure, locator choices
type: project
---

## Auth bypass for external sites

All specs targeting playwright.dev (or any non-saucedemo URL) must clear the saved auth state at the describe level:

```ts
test.use({ storageState: { cookies: [], origins: [] } });
```

**Why:** The global setup saves saucedemo session cookies to `.auth/user.json`. Without clearing this, Playwright injects those cookies into playwright.dev requests, which is harmless but semantically wrong and may cause unexpected behaviour if cookie domains ever collide.

## Full URLs in goto()

Because `baseURL` is `https://www.saucedemo.com/`, page objects for external sites must use full absolute URLs in `goto()`:

```ts
await this.page.goto("https://playwright.dev/");
```

Never use a relative path like `"/"` for external-site page objects.

## Locator choices confirmed for playwright.dev

| Element | Locator |
|---|---|
| Search trigger button | `getByRole("button", { name: "Search (Ctrl+K)" })` |
| Search input | `getByRole("searchbox", { name: "Search" })` |
| Result item | `getByRole("option", { name: resultName })` |
| Section heading | `getByRole("heading", { name: "..." })` |

These were derived from YAML selector hints and match the semantic-first locator priority order.

## Established external page objects

| Page Object class | File | Purpose |
|---|---|---|
| `PlaywrightHomePage` | `src/pages/playwrightHome.page.ts` | Homepage navigation, Get Started link |
| `PlaywrightDocsPage` | `src/pages/playwrightDocs.page.ts` | Docs navigation, sidebar links, heading getters |

## PlaywrightDocsPage heading getters (confirmed)

| Getter | Heading text | Level |
|---|---|---|
| `installationHeading` | `'Installation'` | 1 |
| `writingTestsHeading` | `'Writing tests'` | 1 |
| `apiHeading` | `'Playwright Library'` | 1 |
| `uiModeHeading` | `'UI Mode'` | none (exact) |
| `debuggingHeading` | `'Debugging tests'` | 1 |
| `testGeneratorHeading` | `'Generating tests'` | 1 |
| `annotationsHeading` | `'Annotations'` | 1 |
| `webServerHeading` | `'Web server'` | 1 |

`clickSidebarLink(name)` uses `.first()` internally — no extra disambiguation needed at the call site.

## Docs sidebar URL mapping (confirmed)

| Sidebar link text | Expected URL |
|---|---|
| `'Writing tests'` | `https://playwright.dev/docs/writing-tests` |
| `'Web server'` | `https://playwright.dev/docs/test-webserver` |

## Spec file naming

External-site spec files use camelCase: `getStarted.spec.ts`, `searchDocs.spec.ts`.
This matches the existing project precedent — do not convert to kebab-case for these files.

**Why:** `getStarted.spec.ts` already exists with camelCase. Consistency within the external-site subset matters more than aligning with the kebab-case convention used for saucedemo specs.
**How to apply:** When generating new playwright.dev specs, use camelCase file names.
