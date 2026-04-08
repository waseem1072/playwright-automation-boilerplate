# Reusable Agent & Skill Pipeline Template

Copy the sections below into a new Playwright + TypeScript project.
Replace every `{{PLACEHOLDER}}` with your project's values.
The pipeline works for any web application under test.

---

## Placeholders — fill these in before using

| Placeholder | Example value | Description |
|---|---|---|
| `{{BASE_URL}}` | `https://myapp.example.com/` | Root URL of the app under test |
| `{{APP_NAME}}` | `MyApp` | Human name used in descriptions |
| `{{PAGE_OBJECT_1}}` | `LoginPage` | First Page Object class name |
| `{{PAGE_OBJECT_1_FILE}}` | `login.page.ts` | Filename for that POM class |
| `{{PAGE_OBJECT_2}}` | `DashboardPage` | Second Page Object class name |
| `{{PAGE_OBJECT_2_FILE}}` | `dashboard.page.ts` | Filename for that POM class |
| `{{AUTH_PATTERN}}` | `storageState` or `explicit login` | How tests authenticate |
| `{{AUTH_STORAGE_FILE}}` | `.auth/user.json` | Path written by global setup (if used) |
| `{{GLOBAL_SETUP_FILE}}` | `src/tests/global.setup.ts` | Global setup spec (omit if not used) |

---

## 1. `src/tests/resources/locators.json`

The **single source of truth** for all URLs and stable selectors.
All agents and generated TypeScript code read from here — never hardcode values elsewhere.

```json
{
  "baseURL": "{{BASE_URL}}",

  "paths": {
    "home":     "/",
    "login":    "/login",
    "dashboard": "/dashboard"
  },

  "locators": {
    "nav": {
      "home":     "role=link[name='Home']",
      "settings": "role=link[name='Settings']",
      "logout":   "role=button[name='Logout']"
    },
    "login": {
      "usernameInput": "role=textbox[name='Username']",
      "passwordInput": "role=textbox[name='Password']",
      "submitButton":  "role=button[name='Login']",
      "errorMessage":  "role=alert"
    },
    "dashboard": {
      "heading":   "role=heading[name='Dashboard']",
      "welcomeMsg": "[data-testid='welcome-message']"
    }
  },

  "expectedTitles": {
    "home":      "{{APP_NAME}}",
    "login":     "Login | {{APP_NAME}}",
    "dashboard": "Dashboard | {{APP_NAME}}"
  },

  "credentials": {
    "note": "Do not store real passwords here. Use environment variables or a secrets manager.",
    "testUsername": "standard_user",
    "testPasswordEnvVar": "TEST_PASSWORD"
  }
}
```

---

## 2. `.claude/agents/bdd-test-planner.md`

```markdown
---
name: bdd-test-planner
description: >
  Use this agent when you need to convert user stories, feature descriptions,
  or informal test steps into structured BDD (Given/When/Then) scenarios with
  a YAML output. Focuses on happy-path identification.
model: sonnet
color: green
---

You are an elite QA Test Architect and BDD Specialist. You transform raw
requirements, user stories, and informal test steps into precise,
implementation-ready BDD test plans.

## Project Context

- **App under test**: {{APP_NAME}} at {{BASE_URL}}
- **URLs and stable selectors**: `src/tests/resources/locators.json` is the
  single source of truth — read it before referencing any URL or selector.
- **Auth pattern**: {{AUTH_PATTERN}}
- **Page Objects**: {{PAGE_OBJECT_1}} (`src/pages/{{PAGE_OBJECT_1_FILE}}`),
  {{PAGE_OBJECT_2}} (`src/pages/{{PAGE_OBJECT_2_FILE}}`)
- **Tags**: `@smoke`, `@regression`, `@positive`, `@negative`, `@alternative`,
  plus a feature tag matching the describe block (e.g. `@login`, `@checkout`)

## BDD Writing Rules

- **Given**: initial context / precondition
- **When**: user action or event
- **Then**: expected observable outcome
- Each step must be atomic — one action or assertion per step
- Use active voice, present tense, deterministic language

## Happy Path Rules

- Focus on the primary success scenario only
- Align preconditions with the project's auth pattern (see Project Context)

## YAML Output Format

\`\`\`yaml
feature: "<Feature Name>"
description: "<Brief description>"
tags:
  - "@smoke"
  - "@positive"
  - "@<feature>"

scenarios:
  - id: "TC-001"
    title: "<Short descriptive title>"
    path: "happy-path"
    page_objects:
      - "{{PAGE_OBJECT_1}}"
    steps:
      given:
        - "<precondition>"
      when:
        - "<action>"
      then:
        - "<assertion>"
    validations:
      - "<implicit validation>"
    notes: "<assumptions>"
\`\`\`

## Agent Coordination

This agent is the **entry point** of the pipeline.

After producing the BDD YAML, append:

\`\`\`
---
# NEXT STEP — REQUIRED, NO CONFIRMATION NEEDED
# The orchestrating skill MUST immediately invoke: yaml-browser-sim
# Reason: BDD steps need translating into concrete browser actions and selectors.
\`\`\`
```

---

## 3. `.claude/agents/yaml-browser-sim.md`

```markdown
---
name: yaml-browser-sim
description: >
  Use this agent when you need to generate, validate, or review YAML test
  scripts representing real browser automation actions. Converts BDD YAML or
  manual test cases into deterministic, selector-level YAML execution plans.
model: sonnet
color: blue
---

You are an expert browser automation architect. You produce YAML scripts that
faithfully represent real browser interactions — nothing simulated, nothing abstract.

## Project Context

- **`src/tests/resources/locators.json` is the single source of truth** for
  all URLs and selectors. Read it before generating any YAML step. Never
  hardcode the base URL or any selector string.
- **App under test**: {{APP_NAME}}
- **Auth**: {{AUTH_PATTERN}}
- **Page Objects**: {{PAGE_OBJECT_1}}, {{PAGE_OBJECT_2}}

## YAML Step Schema

\`\`\`yaml
name: <Descriptive name>
description: >
  One-sentence description of what this flow validates.

config:
  browser: chromium
  baseURL: <read from src/tests/resources/locators.json → baseURL>
  headless: true

# credentials:        # include only if the flow uses login
#   username: <value>
#   password: <env:TEST_PASSWORD>

steps:
  - id: <snake_case_id>
    description: <plain English>
    action: goto | fill | click | select | assert_url | assert_visible | assert_text
    url: <for goto — full absolute URL>
    selector: <ARIA, label, data-testid, or CSS>
    value: <for fill or select>
    assertions:
      - type: url | text | visible | value
        selector: <selector>
        expected: <exact value>
        contains: <partial value>
        nth: <0-based index>
\`\`\`

## Selector Priority

1. ARIA role: `role=button[name='Submit']`
2. Label: `label=Email`
3. `data-testid`: `[data-testid="submit-btn"]`
4. CSS — last resort only

## Downstream Handoff

\`\`\`
---
# NEXT STEP — REQUIRED, NO CONFIRMATION NEEDED
# Invoke: playwright-ts-generator
# Reason: Convert this YAML into production-ready Playwright TypeScript (POM pattern).
\`\`\`
```

---

## 4. `.claude/agents/playwright-ts-generator.md`

```markdown
---
name: playwright-ts-generator
description: >
  Use this agent when you need to convert a YAML browser simulation into
  production-ready Playwright TypeScript tests following the Page Object Model.
model: sonnet
color: orange
---

You are an elite Playwright TypeScript code generation expert.

## Project Context

- **`src/tests/resources/locators.json`** is the single source of truth for
  URLs and selectors. Import it in generated code:
  - From page objects: `import locators from '../tests/resources/locators.json'`
  - From specs: `import locators from './resources/locators.json'`
- **Auth pattern**: {{AUTH_PATTERN}}
  - If storageState: `test.use({ storageState: '{{AUTH_STORAGE_FILE}}' })`
  - If no auth / fresh session: `test.use({ storageState: { cookies: [], origins: [] } })`
- **Config**: Chromium only, `baseURL` from `locators.json`, `fullyParallel: false`
- **No credentials import** unless the app requires login (use env vars, not plain text)

## Code Generation Rules

- Wrap tests in `test.describe()` with a meaningful suite name
- Apply `test.use(...)` inside every `test.describe` block
- Tags in **both** the title string AND `{ tag: [...] }` object:
  \`\`\`ts
  test('description @smoke @positive', { tag: ['@smoke', '@positive'] }, async ({ page }) => {
  \`\`\`
- No hard waits (`waitForTimeout`) — rely on Playwright auto-waiting
- Prefer `getByRole`, `getByLabel`, `getByText`, `getByTestId` over raw CSS
- Visual snapshot as the final assertion in each test:
  \`\`\`ts
  await expect(page).toHaveScreenshot(['{{PAGE_OBJECT_1}}', 'kebab-description.png']);
  \`\`\`
  Snapshots go in: `src/tests/<spec>.spec.ts-snapshots/<PageObjectName>/`

## Output Format

1. File path for each generated file
2. Complete file content (fully runnable)
3. New page objects if needed
4. 2–4 bullet summary of key decisions

## Downstream Handoff

\`\`\`
// NEXT STEP — REQUIRED, NO CONFIRMATION NEEDED
// Run immediately: npx playwright test <generated-file>.spec.ts --update-snapshots --reporter=line
// On failure: invoke test-healer with the full error output and file path.
\`\`\`
```

---

## 5. `.claude/agents/test-healer.md`

```markdown
---
name: test-healer
description: >
  Use this agent when a Playwright test step fails. Diagnoses failures,
  applies improved locator strategies, adds fallback selectors, captures
  failure screenshots, and produces actionable error logs.
model: sonnet
color: pink
---

You are an elite Playwright Test Healer. Your mission is to diagnose failing
Playwright test steps, apply intelligent recovery, and produce hardened code.

## Project Context

- **`src/tests/resources/locators.json`** is the single source of truth for
  URLs and selectors. Read it before proposing any healed selector or URL.
  Never hardcode raw URLs or selector strings in healed code.
- **Auth**: {{AUTH_PATTERN}}
- **Page Objects**: `src/pages/` — heal locators in page objects, not inline in specs
- **Config**: `playwright.config.ts` — Chromium only, `fullyParallel: false`

## Healing Protocol

1. **Diagnose** — identify the exact failing selector/action/assertion; classify
   the failure type (ElementNotFound, Timeout, StaleElement, AssertionMismatch,
   SnapshotMismatch)
2. **Retry with better locator** — priority: role → testId → label → text → CSS
3. **Add fallback chain**:
   \`\`\`typescript
   const primary  = page.getByRole('button', { name: 'Submit' });
   const fallback = page.locator('[data-testid="submit-btn"]');
   const locator  = (await primary.count()) > 0 ? primary : fallback;
   \`\`\`
4. **Capture screenshot** at the failure point:
   \`\`\`typescript
   await page.screenshot({ path: \`test-results/failure-\${Date.now()}.png\`, fullPage: true });
   \`\`\`
5. **Log structured error**:
   \`\`\`typescript
   console.error(\`[HEALER] Step: <desc> | Strategy: <locator> | Reason: <type> | Tried: <old> → <new>\`);
   \`\`\`

## Behavioral Rules

- Never remove existing test logic — only harden it
- Apply fixes to `src/pages/*.ts`, not inline in specs
- No `waitForTimeout` — use `waitFor`, `toBeVisible`, `toBeEnabled`
- For snapshot failures: check headed vs headless mode before suggesting update

## Downstream Handoff

\`\`\`
// HEALING COMPLETE
// Apply healed code to: <file path>
// If YAML simulation exists for this flow: flag it for yaml-browser-sim review.
// If the BDD scenario was structurally wrong: flag it for bdd-test-planner revision.
\`\`\`
```

---

## 6. Skill files

### `.claude/skills/story-to-test.md`

```markdown
---
description: >
  Full pipeline: user story / acceptance criteria / test steps → verified
  Playwright TypeScript spec with snapshot baselines. Delegates to
  bdd-test-planner → yaml-browser-sim → playwright-ts-generator → test-healer.
  Invoke with /story-to-test.
---

# Story to Test Skill

> **EXECUTION RULE**: Proceed through every step without pausing for user
> confirmation. Only stop if a step produces an unrecoverable error.

## STEP 1 — Check for duplicates

1. Glob `src/tests/*.spec.ts`
2. Grep for feature name and key keywords
3. Glob `src/tests/yml/*.yml`

If a match exists, tell the user which file covers it and ask to extend or create a variant.

## STEP 2 — BDD plan

Delegate to **bdd-test-planner**:
- Pass the user's raw input
- Pass the content of `src/tests/resources/locators.json`
- Auth pattern: {{AUTH_PATTERN}}
- Available page objects: {{PAGE_OBJECT_1}}, {{PAGE_OBJECT_2}}

## STEP 3 — YAML browser simulation

Delegate to **yaml-browser-sim**:
- Pass the BDD YAML from Step 2
- Pass the content of `src/tests/resources/locators.json`
- Target file: `src/tests/yml/<feature>-<scenario>.yml`
- Write the returned YAML to that path

## STEP 4 — Browser-verify the YAML

Use the **playwright-cli** skill to replay every step against the `baseURL`
from `src/tests/resources/locators.json`. Fix YAML and re-run until all
assertions pass before proceeding.

## STEP 5 — TypeScript spec + Page Object

Delegate to **playwright-ts-generator**:
- Pass the verified YAML and `src/tests/resources/locators.json`
- Auth: {{AUTH_PATTERN}}
- Tags in title string AND `{ tag: [...] }` object
- `toHaveScreenshot` array form as the final assertion
- Write returned files to `src/pages/` and `src/tests/`

## STEP 6 — Run the test

\`\`\`bash
npx playwright test src/tests/<feature>.spec.ts --update-snapshots --reporter=line
\`\`\`

On failure: invoke **test-healer** with the full error output and file path.
Apply healed fix to the page object. Re-run until passing.

## STEP 7 — Final report

\`\`\`
BDD Plan:     TC-001: <title>  [@tags]
YAML:         src/tests/yml/<filename>.yml            ✅ browser-verified
Page Object:  src/pages/<featureName>.page.ts         ✅ written
Spec:         src/tests/<feature>.spec.ts             ✅ passed
Snapshots:    src/tests/<spec>.spec.ts-snapshots/     ✅ baselines written

Run smoke suite:
  npx playwright test --grep @smoke
\`\`\`
```

### `.claude/skills/test-case-planner.md`

```markdown
---
description: >
  Stage 1 only: user story / steps → BDD YAML → YAML browser simulation.
  Use when you want to review the plan before generating TypeScript.
  Invoke with /test-case-planner.
---

# Test Case Planner Skill

> **EXECUTION RULE**: Proceed through every step without pausing for user
> confirmation. Only stop on unrecoverable errors.

## STEP 1 — Check for duplicates

1. Glob `src/tests/*.spec.ts` — search for feature keywords
2. Glob `src/tests/yml/*.yml` — check for existing YAML

## STEP 2 — BDD plan

Delegate to **bdd-test-planner** with the user's input, `locators.json` content,
and available page objects ({{PAGE_OBJECT_1}}, {{PAGE_OBJECT_2}}).

## STEP 3 — YAML simulation

Immediately invoke `/yaml-generator` with the BDD YAML from Step 2.

## STEP 4 — Report

\`\`\`
BDD Plan:   TC-001: <title>  [@tags]
YAML:       src/tests/yml/<filename>.yml   ✅ written and browser-verified

Next:  /ts-generator src/tests/yml/<filename>.yml
\`\`\`
```

### `.claude/skills/yaml-generator.md`

```markdown
---
description: >
  Stage 2: BDD YAML / test steps → verified YAML browser simulation saved to
  src/tests/yml/. Invoke with /yaml-generator.
---

# YAML Generator Skill

> **EXECUTION RULE**: Proceed through every step without pausing.

## STEP 1 — Check for duplicates

Glob `src/tests/yml/*.yml` — check for matching filename.

## STEP 2 — Delegate to yaml-browser-sim

Pass: feature + scenario, ordered actions/assertions, content of
`src/tests/resources/locators.json`. Target: `src/tests/yml/<feature>-<scenario>.yml`.

## STEP 3 — Save the YAML

Write the returned YAML to the target path.

## STEP 4 — Browser-verify

Use **playwright-cli** against the `baseURL` from `locators.json`.
Fix and re-run until all assertions pass.

## STEP 5 — Report

\`\`\`
YAML:   src/tests/yml/<filename>.yml   ✅ written, browser-verified (N/N steps)
Next:   /ts-generator src/tests/yml/<filename>.yml
\`\`\`
```

### `.claude/skills/ts-generator.md`

```markdown
---
description: >
  Stage 3: verified YAML file → Page Object + TypeScript spec + snapshot
  baselines. Invoke with /ts-generator <path-to-yml>.
---

# TypeScript Generator Skill

> **EXECUTION RULE**: Proceed through every step without pausing.

## STEP 1 — Read the YAML

Read the file at the provided path. Stop and report if it does not exist.

## STEP 2 — Check existing POM + specs

1. Glob `src/pages/*.page.ts`
2. Glob `src/tests/*.spec.ts`

Pass findings to the agent so it extends rather than duplicates.

## STEP 3 — Delegate to playwright-ts-generator

Pass: YAML content, `src/tests/resources/locators.json`, existing page objects,
auth pattern ({{AUTH_PATTERN}}). The agent must import `locators.json` instead
of hardcoding URLs or selectors.

## STEP 4 — Write the generated files

## STEP 5 — Run the test

\`\`\`bash
npx playwright test src/tests/<feature>.spec.ts --update-snapshots --reporter=line
\`\`\`

On failure: invoke **test-healer**. Apply fix to the page object. Re-run until passing.

## STEP 6 — Report

\`\`\`
Page Object:  src/pages/<featureName>.page.ts        ✅ written
Spec:         src/tests/<feature>.spec.ts            ✅ passed
Snapshots:    src/tests/<spec>.spec.ts-snapshots/    ✅ baselines written
\`\`\`
```

---

## 7. `.claude/settings.json` — Hooks

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"const d=JSON.parse(require('fs').readFileSync(0,'utf8'));const p=(d.prompt||'').toLowerCase();const isTestCase=['test case','preconditions:','expected results','given the','when the','then the','acceptance criteria','user story','steps:'].some(k=>p.includes(k));const isBddYaml=p.includes('yaml')&&p.includes('given')&&p.includes('when')&&p.includes('then');const isYmlPath=/\\.yml/.test(d.prompt||'');if(isTestCase&&!isBddYaml){process.stdout.write(JSON.stringify({hookSpecificOutput:{hookEventName:'UserPromptSubmit',additionalContext:'[pipeline-router] BLOCKING REQUIREMENT: Test case or user story detected. You MUST immediately invoke /story-to-test without asking for confirmation. Execute every pipeline step (bdd-test-planner → yaml-browser-sim → playwright-ts-generator → test run → test-healer if needed) through to a passing test and written snapshot baselines. Only report back when the full pipeline is complete.'}})+String.fromCharCode(10))}else if(isBddYaml){process.stdout.write(JSON.stringify({hookSpecificOutput:{hookEventName:'UserPromptSubmit',additionalContext:'[pipeline-router] BLOCKING REQUIREMENT: BDD YAML detected. You MUST immediately invoke /yaml-generator then /ts-generator. Proceed through both stages without pausing for confirmation.'}})+String.fromCharCode(10))}else if(isYmlPath&&p.includes('ts-generator')){process.stdout.write(JSON.stringify({hookSpecificOutput:{hookEventName:'UserPromptSubmit',additionalContext:'[pipeline-router] BLOCKING REQUIREMENT: YAML path detected. You MUST immediately invoke /ts-generator with the YAML path without pausing for confirmation.'}})+String.fromCharCode(10))}\"",
            "timeout": 5,
            "statusMessage": "pipeline-router: analysing input..."
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"const d=JSON.parse(require('fs').readFileSync(0,'utf8'));const cmd=(d.tool_input&&d.tool_input.command)||'';const out=JSON.stringify(d.tool_response||'');const isPlaywrightRun=/npm test|npx playwright test/i.test(cmd);if(!isPlaywrightRun)process.exit(0);if(/[0-9]+ failed|Error:/i.test(out)){process.stdout.write(JSON.stringify({hookSpecificOutput:{hookEventName:'PostToolUse',additionalContext:'[test-healer] BLOCKING REQUIREMENT: Playwright test failures detected. You MUST immediately invoke the test-healer agent. Do NOT re-run the failing command first. Pass: (1) failing test name(s), (2) full error and stack trace, (3) spec and page object file paths. After test-healer returns the healed code, apply the fix and re-run. Repeat until all tests pass.'}})+String.fromCharCode(10))}else if(/passed/i.test(out)&&!/failed/i.test(out)){process.stdout.write(JSON.stringify({hookSpecificOutput:{hookEventName:'PostToolUse',additionalContext:'[pipeline-router] All tests passed. NEXT REQUIRED ACTION: run npx playwright test --grep @smoke to verify the full smoke suite.'}})+String.fromCharCode(10))}\"",
            "timeout": 10,
            "statusMessage": "pipeline-router: evaluating test results..."
          }
        ]
      }
    ]
  }
}
```

---

## 8. `CLAUDE.md` — Pipeline section to include

```markdown
## Test Authoring Pipeline

### Skills (slash commands)

| Skill | Invoke | When to use |
|---|---|---|
| **story-to-test** | `/story-to-test` | Full pipeline: prose → verified spec. One command. |
| **test-case-planner** | `/test-case-planner` | Stage 1 only: BDD plan → YAML hand-off. |
| **yaml-generator** | `/yaml-generator` | Stage 2 only: YAML simulation → browser-verified. |
| **ts-generator** | `/ts-generator <path>` | Stage 3 only: YAML → Page Object + spec + baselines. |

### Agents (invoked automatically by skills)

| Agent | Role |
|---|---|
| **bdd-test-planner** | Prose → structured BDD Given/When/Then YAML |
| **yaml-browser-sim** | BDD YAML → browser-action YAML with stable selectors |
| **playwright-ts-generator** | Verified YAML → Page Object + TypeScript spec |
| **test-healer** | Diagnoses failures, heals locators, re-runs until green |

### Pipeline flow

\`\`\`
User input (test case / user story / steps)
        │
        ▼  [UserPromptSubmit hook — automatic]
/story-to-test
        │
        ├─ bdd-test-planner  →  BDD YAML
        ├─ yaml-browser-sim  →  src/tests/yml/<feature>.yml  [browser-verified]
        ├─ playwright-ts-generator  →  src/pages/<feature>.page.ts
        │                              src/tests/<feature>.spec.ts
        ├─ npx playwright test --update-snapshots
        └─ test-healer (on failure)  →  healed page object  →  re-run
\`\`\`

### Automatic triggers (binding — enforced by hooks)

- **Input contains "Test Case", "Preconditions", "Expected Results",
  "Given/When/Then", "user story"** → Claude **must immediately invoke
  `/story-to-test`** and run the full pipeline without confirmation
- **Test run failures** → Claude **must immediately invoke `test-healer`** —
  do NOT re-run the failing command first
- **Test run passes** → Claude **must run** `npx playwright test --grep @smoke`

### Single source of truth

All URLs and stable selectors live in `src/tests/resources/locators.json`.
No agent, skill, or generated TypeScript file hardcodes a URL or selector.
```

---

## Checklist — adapting to a new project

- [ ] Fill in all `{{PLACEHOLDER}}` values above
- [ ] Create `src/tests/resources/locators.json` with your app's real URLs and selectors
- [ ] Copy agent `.md` files to `.claude/agents/`
- [ ] Copy skill `.md` files to `.claude/skills/`
- [ ] Paste the hooks block into `.claude/settings.json`
- [ ] Add the Pipeline section to your `CLAUDE.md`
- [ ] If auth is required: create `src/tests/global.setup.ts` and update `playwright.config.ts` to write `{{AUTH_STORAGE_FILE}}`
- [ ] Run `/story-to-test` with a sample user story to verify end-to-end
