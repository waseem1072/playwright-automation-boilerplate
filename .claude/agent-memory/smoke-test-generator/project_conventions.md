---
name: Project Conventions and Selector Patterns
description: Key conventions, selectors, import paths, and spec patterns discovered in the saucedemo Playwright project
type: project
---

## Credentials import path
Credentials live at `src/tests/resources/credentials.ts` (NOT `resources/credentials.ts` at root).
Import as: `import { credentials } from "./resources/credentials";` from inside `src/tests/`.

**Why:** The glob search for `resources/*.ts` at root returned nothing; the actual file is nested under `src/tests/resources/`.

**How to apply:** Always use the `./resources/credentials` relative import in spec files under `src/tests/`.

## Tag convention in specs
Tags are applied via the `{ tag: [...] }` options object on `test()`, not in the title string.
Example: `test("should ...", { tag: ["@smoke", "@positive"] }, async ({ page }) => { ... })`
Suite-level tags go in the `test.describe()` title string (e.g. `"logout feature @smoke @positive"`).

## Page object instantiation pattern
Page objects are declared at describe-block scope and instantiated in `beforeEach`:
```typescript
let loginPage: LoginPage;
let navbarPage: NavbarPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  navbarPage = new NavbarPage(page);
  ...
});
```

## NavbarPage method
`navbarPage.navigateToNavbarOption(option: string)` opens the hamburger menu (`#react-burger-menu-btn`) then clicks `//a[@id="${option}_sidebar_link"]`.
Call as: `await navbarPage.navigateToNavbarOption("logout");`

## LoginPage selectors (actual, from page object internals)
- Username: `#user-name` (page object uses this internally; `[data-test="username"]` works in YAML)
- Password: `#password`
- Login button: `#login-button`

## Products page verification selector
`.title` with text `"Products"` — used across multiple specs to confirm landing on inventory page.

## YAML step structure
Each step has an `id`, `description`, and either `action`+`actions` or `assertions` (or both).
The `open_browser`, `navigate_to_app`, `login`, and `verify_products_page` steps are boilerplate repeated across all YAML files.

## YML files location
`src/tests/yml/` — one file per feature flow.

## afterEach failure screenshot pattern
Always include afterEach with `testInfo.status !== testInfo.expectedStatus` guard, screenshot saved to `test-results/screenshots/`, attached via `testInfo.attach`.
