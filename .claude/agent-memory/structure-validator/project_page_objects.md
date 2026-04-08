---
name: Page Objects — Active Inventory and Conventions
description: Three active POM classes as of 2026-04-07; naming and structure conventions confirmed
type: project
---

Active page objects in `src/pages/`:

| File | Class | Consumed by |
|---|---|---|
| `playwrightHome.page.ts` | `PlaywrightHomePage` | smoke, e2e, getStarted specs |
| `playwrightDocs.page.ts` | `PlaywrightDocsPage` | smoke, e2e, getStarted, webServer specs |
| `playwrightCommunity.page.ts` | `PlaywrightCommunityPage` | e2e.spec.ts only |

Conventions confirmed:
- Files: `camelCase.page.ts` (e.g. `playwrightHome.page.ts`)
- Classes: PascalCase matching filename (e.g. `PlaywrightHomePage`)
- Constructor: `constructor(private readonly page: Page)`
- No hardcoded baseURL — methods call `this.page.goto('https://playwright.dev/...')`
- Methods: camelCase (e.g. `clickDocsNav`, `selectLanguage`, `navigateTo`)
- Getters: camelCase (e.g. `heroHeading`, `installationHeading`)

**How to apply:** When adding a new page object, follow the camelCase filename / PascalCase class pattern exactly. The class name must match the snapshot directory name used in `toHaveScreenshot(['ClassName', '...'])`.
