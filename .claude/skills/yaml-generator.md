---
description: >
  Stage 1 of the two-step pipeline: convert test steps, BDD scenarios, or
  acceptance criteria into a verified YAML browser simulation file saved to
  src/tests/yml/. Delegates to the yaml-browser-sim agent for generation and
  browser verification. Invoke with /yaml-generator.
---

# YAML Generator Skill

You are orchestrating Stage 1 of the test authoring pipeline for this
playwright.dev Playwright + TypeScript project.

When the user provides test steps, a BDD YAML from `bdd-test-planner`, or a
feature flow description, follow the pipeline below **in order**.

---

## STEP 1 — Check for duplicates

Before generating anything:

1. Glob `src/tests/yml/*.yml` — list all YAML files
2. Check if a file with a matching feature name or scenario already exists

**If a match exists:** tell the user which file covers it and ask whether to
extend it or create a variant.

**If no match:** proceed to Step 2.

---

## STEP 2 — Delegate to the yaml-browser-sim agent

Hand the input to the **yaml-browser-sim** agent.

Tell the agent:
- The feature name, scenario, and ordered list of browser actions and
  assertions
- That this project targets **playwright.dev** — base URL is in `src/tests/resources/locators.json → baseURL`; pass the file content to the agent so it uses those values directly
- That no login is required — never add credential steps
- The target filename: `src/tests/yml/<feature>-<scenario>.yml`
- To use the project's YAML schema (nested `assertions` blocks per step,
  `goto` not `navigate`, no `launch` step, snake_case step IDs)
- To add `# REVIEW:` comments on any potentially fragile selector
- To end its response with the downstream handoff note

Wait for the agent to return the complete YAML before proceeding.

---

## STEP 3 — Save the YAML file

Write the YAML returned by the agent to `src/tests/yml/<feature>-<scenario>.yml`.

---

## STEP 4 — Browser-verify via playwright-cli

Use the **playwright-cli** skill to replay the saved YAML against the live site:

1. Open the `baseURL` from `src/tests/resources/locators.json`
2. Execute each step's action in order
3. Assert each assertion
4. Capture a screenshot at the final assertion step
5. Report which steps passed and which failed

**If any step fails:**
- Fix the YAML (selector, assertion value, or missing step)
- Update the file and re-run until every assertion passes
- If a selector matches multiple elements, add `nth: 0` and a `# REVIEW:` comment
- Do not proceed to Step 5 until all assertions pass

---

## STEP 5 — Report

```
YAML:   src/tests/yml/<filename>.yml   ✅ written
        Browser verification: PASSED (N/N steps)

Next step:
  Run /ts-generator src/tests/yml/<filename>.yml
  to generate the Page Object and TypeScript spec.
```
