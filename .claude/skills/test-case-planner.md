---
description: >
  Entry point of the test authoring pipeline. Convert a user story, feature
  description, or informal test steps into structured BDD test cases
  (Given/When/Then), then hand off to yaml-generator to produce the YAML file.
  Invoke with /test-case-planner.
---

# Test Case Planner Skill

> **EXECUTION RULE**: Run every step below **without pausing for user confirmation** between steps. Do not ask "shall I proceed?" between Step 2 (BDD plan) and Step 3 (yaml-generator). Proceed automatically through all steps. Only stop to ask the user if there is an unrecoverable error.

You are orchestrating the first stage of the test authoring pipeline for this
playwright.dev Playwright + TypeScript project.

When the user provides a feature description, user story, or informal steps,
follow the pipeline below **in order**. Do not skip any step.

---

## STEP 1 — Check for duplicate coverage

Before planning anything, search the existing test suite:

1. Glob `src/tests/ts/*.spec.ts` and note all spec files
2. Grep for the feature name and key keywords inside those specs
3. Glob `src/tests/yml/*.yml` to check for matching YAML simulations

**If a match exists:** tell the user which file covers it and ask whether to
extend or create a variant.

**If no match:** proceed to Step 2.

---

## STEP 2 — Delegate to the bdd-test-planner agent

Hand the user's input to the **bdd-test-planner** agent to produce a
structured BDD YAML plan.

Tell the agent:
- The raw user input (feature description / user story / steps)
- That this project targets **playwright.dev** — no login required
- The available page objects: `PlaywrightHomePage`, `PlaywrightDocsPage`, `PlaywrightCommunityPage`
- To output the BDD YAML and a downstream handoff note

Wait for the agent to return the BDD YAML before proceeding.

---

## STEP 3 — Hand off to yaml-generator

Once the BDD YAML is returned, immediately invoke the `/yaml-generator` skill
and pass it:
- The BDD YAML from Step 2
- The feature name and scenario label
- The starting URL extracted from the Given steps

The yaml-generator skill will delegate to the **yaml-browser-sim** agent to
produce and browser-verify the `src/tests/yml/<feature>-<scenario>.yml` file.

---

## STEP 4 — Report

After the yaml-generator completes, output a concise summary:

```
BDD Plan:
  Feature: <name>
  Scenarios planned:
    TC-001: <title>  [@tags]
      Given / When / Then (one-liner)

YAML:   src/tests/yml/<filename>.yml   ✅ written and browser-verified

Next step:
  Run /ts-generator src/tests/yml/<filename>.yml
  to generate the Page Object and TypeScript spec.
```
