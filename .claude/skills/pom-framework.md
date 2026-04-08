---
description: >
  Full-pipeline automation skill with strict POM compliance checking.
  Use this instead of /story-to-test when you need: explicit folder
  structure validation at every step, a test data file in src/tests/resources/,
  or a 9-step audit trail (parse → duplicate-check → YAML → browser-verify →
  Page Object → spec → test data → run → report).
  Use /story-to-test for quick end-to-end runs without the extra scaffolding.
  Invoke with /pom-framework.
---

# POM Framework Automation Skill

> **EXECUTION RULE**: Run every step below **without pausing for user confirmation** between steps. Do not ask "shall I proceed?" or summarise intermediate results mid-pipeline. Proceed automatically from Step 1 through Step 9. Only stop to ask the user if a step produces an unrecoverable error that requires a decision.

You are a senior QA automation engineer working in a Playwright + TypeScript project
that follows the **Page Object Model (POM)** pattern. When the user provides a feature,
user story, test steps, or acceptance criteria, execute the pipeline below **in order**.
Do not skip any step.

---

## Folder Structure — Non-Negotiable

Every file you create must land in the correct folder. Reject or correct any path that
violates this layout.

```
src/
├── pages/                        ← Page Object classes (one file per page/component)
│   └── <featureName>.page.ts
└── tests/
    ├── ts/                       ← Playwright spec files
    │   └── <feature>.spec.ts
    ├── resources/                ← Test data, credentials, fixtures, constants
    │   └── <data>.ts | .json
    └── yml/                      ← YAML browser simulation files
        └── <feature>-<scenario>.yml
```

Naming conventions:
- Page Objects: `camelCase.page.ts` (e.g. `loginPage.page.ts`, `shoppingCart.page.ts`)
- Spec files: `camelCase.spec.ts` (e.g. `login.spec.ts`, `checkout.spec.ts`)
- YAML files: `kebab-case.yml` (e.g. `login-happy-path.yml`, `checkout-empty-cart.yml`)
- Resource files: `camelCase.ts` (e.g. `credentials.ts`, `testData.ts`)

---

## STEP 1 — Parse the input

Extract from the user's input:
- **Feature name** — what page or component is being tested
- **Scenario type** — happy path, negative, alternative, edge case
- **Tags** to apply:
  - `@smoke` for happy path / critical flows
  - `@regression` for negative / edge cases
  - `@positive` / `@negative` for polarity
  - `@alternative` for non-happy-path success flows
  - Feature tag matching the describe block (e.g. `@login`, `@cart`, `@checkout`)
- **Auth pattern**:
  - StorageState (skip login, go directly to post-login URL) — use when the flow starts after login
  - Explicit login in `beforeEach` — use when the flow tests login itself or needs a clean session
- **Test data needed** — credentials, product names, form values, etc.

---

## STEP 2 — Check for duplicates

Before generating anything, search the existing test suite:

1. Glob `src/tests/ts/*.spec.ts` to list all spec files
2. Grep for the feature name, scenario keywords, and key selectors inside those files
3. Glob `src/tests/yml/*.yml` to check for an existing YAML simulation

**If a match exists:** tell the user which file covers it and ask whether to extend or create a variant.
**If no match:** proceed to Step 3.

---

## STEP 3 — Generate the YAML browser simulation

Use the **yaml-browser-sim** agent to create the YAML simulation file. Pass it the content of `src/tests/resources/locators.json` so it uses the correct `baseURL` and selectors without hardcoding them.

**Save to:** `src/tests/yml/<feature>-<scenario>.yml`

Instruct the agent to use this YAML schema:

```yaml
name: <Descriptive name>
description: >
  One-sentence description of what this flow validates.

config:
  browser: chromium
  baseURL: <read from src/tests/resources/locators.json → baseURL>
  headless: true

credentials:              # include only if the flow uses login
  username: <username>
  password: <password>

steps:
  - id: <snake_case_id>
    description: <what this step does>
    action: goto | fill | click | select | assert_url | assert_visible | assert_text
    url: <for goto>
    selector: <for fill/click/assert>
    value: <for fill/select>
    assertions:
      - type: url | text | visible | value
        selector: <CSS or ARIA selector>
        expected: <exact value>
        contains: <partial value>
        nth: <index>          # for list items
```

Rules:
- Every step must have a unique `id`
- Assertions belong on the step that produces the verifiable state
- Use semantic ARIA selectors (`role=button[name='...']`) as first choice
- Fall back to `data-test` attributes, then CSS selectors
- Add a `# REVIEW:` comment on any selector that may be fragile

---

## STEP 4 — Verify the YAML in a real browser

Use the **playwright-cli** skill to replay the YAML steps against the live site:

1. `playwright-cli open <baseURL>`
2. Execute each action (fill, click, goto) in order
3. Assert each assertion (url, text, visible)
4. Take a screenshot at the final assertion step with `playwright-cli screenshot --filename=<feature>-verified.png`
5. Report which steps passed and which failed

**If any step fails:**
- Fix the YAML (wrong selector, wrong assertion value, missing wait)
- Re-run that step
- Do not proceed to Step 5 until every assertion passes
- If a selector causes a strict mode violation, use `.first()` or `nth=0` to narrow it

---

## STEP 5 — Create the Page Object

Save to: `src/pages/<featureName>.page.ts`

**Template:**

```ts
import { Page } from '@playwright/test';

export class <FeatureName>Page {
  constructor(private readonly page: Page) {}

  // Navigation
  async navigateTo() {
    await this.page.goto('<URL>');
  }

  // Actions — one method per user action
  async <actionName>(<params>) {
    await this.page.<locator>.<action>();
  }

  // Getters — one per assertion target
  get <elementName>() {
    return this.page.<locator>;
  }
}
```

Rules:
- One class per page or major component
- Methods are named after user actions (`login()`, `addToCart()`, `clickCheckout()`)
- Getters expose locators for assertions in the spec (never assert inside a page object)
- No `expect()` calls inside page objects
- Use `getByRole` as first-choice locator; fall back to `getByLabel`, `getByText`, `locator('[data-test="..."]')`

---

## STEP 6 — Create the TypeScript spec

Save to: `src/tests/ts/<feature>.spec.ts`

**Template:**

```ts
import { test, expect } from '@playwright/test';
import { <FeatureName>Page } from '../../pages/<featureName>.page';
import { <data> } from '../resources/<dataFile>';   // only if test data is used

test.describe('<Feature name>', () => {
  // Auth pattern — always use empty storageState for playwright.dev (no login required)
  test.use({ storageState: { cookies: [], origins: [] } });

  test(
    '<scenario description> @<featureTag> @smoke|@regression @positive|@negative',
    { tag: ['@<featureTag>', '@smoke|@regression', '@positive|@negative'] },
    async ({ page }) => {
      const featurePage = new <FeatureName>Page(page);
      await featurePage.navigateTo();

      // Act — perform user actions
      await featurePage.<action>();

      // Assert
      await expect(page).toHaveURL('<expected URL>');
      await expect(page).toHaveTitle('<expected title>');
      await expect(featurePage.<element>).toBeVisible();
    },
  );
});
```

Rules:
- Tags appear **both** inline in the test title string and in the `{ tag: [...] }` object
- All assertions use `expect()` — never assert inside page objects
- Use `toHaveURL` / `toHaveTitle` for page-level assertions
- Use `toBeVisible` / `toHaveText` / `toHaveValue` for element-level assertions
- No hard-coded waits (`page.waitForTimeout`) — rely on Playwright's auto-waiting

**Visual snapshot assertion (required for every test):**

Add `toHaveScreenshot` as the final assertion in each test, using the array form with the page name as the folder:

```ts
await expect(page).toHaveScreenshot(['<PageObjectName>', '<descriptive-name>.png']);
```

- The first element is the **Page Object class name** for the page being asserted (e.g. `'loginPage'`, `'playwrightDocs'`)
- The second element is a kebab-case description of what state the page is in (e.g. `'invalid-login-error.png'`, `'installation-page.png'`)
- This produces: `src/tests/<spec>.spec.ts-snapshots/<PageObjectName>/<name>-<browser>-<platform>.png`
- Always generate baselines by running `npx playwright test --update-snapshots` after writing the spec

---

## STEP 7 — Create or update test data (if needed)

If the test requires credentials, product names, form values, or any reusable constants:

Save to: `src/tests/resources/<dataFile>.ts`

**Example:**

```ts
export const credentials = {
  username: 'standard_user',
  password: 'secret_sauce',
};

export const testData = {
  productName: 'Sauce Labs Backpack',
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '12345',
};
```

Rules:
- This is the **single source of truth** for all test data — never hardcode values in specs
- Import in the spec with: `import { credentials } from '../resources/credentials'`
- Do not store secrets in plain text for real credentials — flag this for the user if applicable

---

## STEP 8 — Run the test

```bash
# First run: generate snapshot baselines
npx playwright test src/tests/ts/<feature>.spec.ts --update-snapshots --reporter=line

# Subsequent runs: compare against baselines
npx playwright test src/tests/ts/<feature>.spec.ts --reporter=line
```

**If the test fails:**
- Invoke the **test-healer** agent with the full error output and the file path
- Apply the healed selector or logic back to the page object
- Re-run until it passes

---

## STEP 9 — Final report

Output a concise summary:

```
YAML:      src/tests/yml/<filename>.yml                               ✅ verified in browser
Page:      src/pages/<featureName>.page.ts                           ✅ written
Spec:      src/tests/ts/<feature>.spec.ts                            ✅ 1 passed
Resources: src/tests/resources/<dataFile>.ts                         ✅ written  (or N/A)
Snapshots: src/tests/ts/<feature>.spec.ts-snapshots/<PageName>/*.png ✅ baselines written

Tests added:
  <describe> › <test name>  [<tags>]

Run smoke suite:
  npx playwright test --grep @smoke
```

If anything was skipped (duplicate found, browser verification failed, no data file needed), explain why.
