---
description: >
  Stage 2 of the two-step pipeline: given a verified YAML browser simulation
  file, generate the Page Object and TypeScript spec. Delegates to the
  playwright-ts-generator agent for code generation, then runs the test to
  create snapshot baselines. Invoke with /ts-generator <path-to-yml>.
---

# TypeScript Generator Skill

You are orchestrating Stage 2 of the test authoring pipeline for this
playwright.dev Playwright + TypeScript project.

When the user provides a YAML file path, follow the pipeline below **in order**.

---

## STEP 1 — Read the YAML file

Read the file at the path the user provides.

If it does not exist, stop and report the error to the user.

Extract:
- Feature name, scenario, and base URL
- All steps and their selectors
- Which pages are visited (determines which Page Objects are needed)

---

## STEP 2 — Check for existing Page Objects and specs

1. Glob `src/pages/*.page.ts` — does a Page Object already cover the URLs
   in the YAML?
2. Glob `src/tests/ts/*.spec.ts` — does a spec already cover this feature?

Pass this information to the agent so it extends rather than duplicates.

---

## STEP 3 — Delegate to the playwright-ts-generator agent

Hand the YAML content to the **playwright-ts-generator** agent.

Tell the agent:
- The full YAML content
- Which existing Page Objects were found (to extend rather than duplicate)
- Which existing spec file to add to (if one exists)
- That this project targets **playwright.dev** — no login, no credentials import
- That the base URL and all stable selectors are in `src/tests/resources/locators.json` — the agent must import this file in generated code instead of hardcoding URLs or selector strings
- That all specs use `test.use({ storageState: { cookies: [], origins: [] } })`
- That tags must appear both in the test title string AND `{ tag: [...] }`
- That every test must end with `toHaveScreenshot` in array form:
  `['<PageObjectClassName>', '<kebab-description>.png']`
- That spec files live in `src/tests/ts/` — import paths must use `../../pages/` and `../resources/`
- To write the Page Object to `src/pages/<featureName>.page.ts`
- To write the spec to `src/tests/ts/<feature>.spec.ts`
- To append the downstream handoff note after generating the files

Wait for the agent to return the complete file contents before proceeding.

---

## STEP 4 — Write the generated files

Write each file returned by the agent to its stated path.

---

## STEP 5 — Run the test and generate snapshot baselines

```bash
npx playwright test src/tests/ts/<feature>.spec.ts --update-snapshots --reporter=line
```

**If the test fails:**
- Invoke the **test-healer** agent with the full error output and the file path
- Apply the healed selector or assertion to the Page Object (not inline in the spec)
- Re-run until the test passes

---

## STEP 6 — Report

```
Page Object:  src/pages/<featureName>.page.ts           ✅ written
Spec:         src/tests/ts/<feature>.spec.ts            ✅ 1 passed
Snapshots:    src/tests/ts/<spec>.spec.ts-snapshots/
                <PageObjectName>/<name>-chromium-win32.png  ✅ baselines written

Tests added:
  <describe block> › <test name>  [@tags]

Run the full smoke suite:
  npx playwright test --grep @smoke
```
