---
description: >
  Full-pipeline skill (quick path): convert a user story, acceptance criteria,
  or test steps into a verified Playwright TypeScript test in one command.
  Delegates to bdd-test-planner → yaml-browser-sim → playwright-ts-generator →
  test-healer as needed. Use this for the fastest end-to-end run.
  Use /pom-framework instead when you need explicit folder-structure enforcement
  or a test data resource file (src/tests/resources/).
  Invoke with /story-to-test.
---

# Story to Test Skill

> **EXECUTION RULE**: Run every step below **without pausing for user confirmation** between steps. Do not ask "shall I proceed?" or summarise intermediate results mid-pipeline. Proceed automatically from Step 1 through Step 7. Only stop to ask the user if a step produces an unrecoverable error that requires a decision.

You are orchestrating the full test authoring pipeline for this playwright.dev
Playwright + TypeScript project. When the user provides a user story, acceptance
criteria, or test steps, execute the pipeline below **in order**.

This is equivalent to running `/test-case-planner` → `/yaml-generator` →
`/ts-generator` in sequence. Use this skill when you want the full pipeline in
one command.

---

## STEP 1 — Check for duplicates

Before generating anything:

1. Glob `src/tests/ts/*.spec.ts` — list all spec files
2. Grep for the feature name and key keywords inside those specs
3. Glob `src/tests/yml/*.yml` — check for matching YAML simulations

**If a match exists:** tell the user which file and test name covers it. Ask
whether to extend the existing test or create a variant.

**If no match:** proceed to Step 2.

---

## STEP 2 — Plan BDD test cases

Delegate to the **bdd-test-planner** agent:
- Pass the user's raw input
- Instruct it that this project targets **playwright.dev** — no login required
- The base URL and all stable selectors are in `src/tests/resources/locators.json` — pass that file's content to the agent
- Page objects available: `PlaywrightHomePage`, `PlaywrightDocsPage`, `PlaywrightCommunityPage`
- Wait for the BDD YAML output before proceeding

---

## STEP 3 — Generate the YAML browser simulation

Delegate to the **yaml-browser-sim** agent:
- Pass the BDD YAML from Step 2
- Base URL: read from `src/tests/resources/locators.json → baseURL` — no credentials needed
- Target file: `src/tests/yml/<feature>-<scenario>.yml`
- Use the project's YAML schema (nested `assertions` per step, `goto` not
  `navigate`, snake_case IDs, no `launch` step)
- Wait for the YAML output, then write it to `src/tests/yml/<feature>-<scenario>.yml`

---

## STEP 4 — Browser-verify the YAML

Use the **playwright-cli** skill to replay every step against the `baseURL` from `src/tests/resources/locators.json`:

1. Execute each action in order
2. Assert each assertion
3. Capture a screenshot at the final assertion step
4. Report which steps passed / failed

**If any step fails:** fix the YAML and re-run until every assertion passes
before proceeding.

---

## STEP 5 — Create the Page Object and TypeScript spec

Delegate to the **playwright-ts-generator** agent:
- Pass the verified YAML content
- Inform it of any existing Page Objects found in `src/pages/`
- Inform it of any existing spec file to extend in `src/tests/ts/`
- Remind it of the project rules:
  - No login / no credentials import
  - `test.use({ storageState: { cookies: [], origins: [] } })` in every describe
  - Tags in both the title string and `{ tag: [...] }` object
  - `toHaveScreenshot` in array form as the final assertion
  - Import paths from `src/tests/ts/` must use `../../pages/` and `../resources/`
- Write the returned files to `src/pages/<featureName>.page.ts` and
  `src/tests/ts/<feature>.spec.ts`

---

## STEP 6 — Run the test and generate snapshot baselines

```bash
npx playwright test src/tests/ts/<feature>.spec.ts --update-snapshots --reporter=line
```

**If the test fails:** invoke the **test-healer** agent with the full error
output and file path. Apply any healed fix to the Page Object, not the spec.
Re-run until the test passes.

---

## STEP 7 — Final report

```
BDD Plan:     TC-001: <title>  [@tags]
YAML:         src/tests/yml/<filename>.yml               ✅ verified in browser
Page Object:  src/pages/<featureName>.page.ts            ✅ written
Spec:         src/tests/ts/<feature>.spec.ts             ✅ 1 passed
Snapshots:    src/tests/ts/<spec>.spec.ts-snapshots/
                <PageObjectName>/<name>-chromium-win32.png  ✅ baselines written

Tests added:
  <describe block> › <test name>  [@tags]

Run smoke suite:
  npx playwright test --grep @smoke
```
