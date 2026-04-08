---
description: >
  Enforces the canonical folder structure: TypeScript spec files in src/tests/ts/,
  YAML simulation files in src/tests/yml/, and test data in src/tests/resources/.
  Use this skill to reorganize existing misplaced files and validate the layout.
  Invoke with /enforce-structure.
---

# Enforce Structure Skill

> **EXECUTION RULE**: Run every step below **without pausing for user confirmation**. Do not ask "shall I proceed?" between steps. Only stop if a step produces an unrecoverable error.

You are enforcing the canonical folder layout for this Playwright + TypeScript project.

---

## Canonical Layout (Non-Negotiable)

```
src/
├── pages/                        ← Page Object classes (one file per page)
│   └── <featureName>.page.ts
└── tests/
    ├── ts/                       ← TypeScript Playwright spec files
    │   └── <feature>.spec.ts
    ├── resources/                ← Test data, fixtures, locators
    │   └── <data>.ts | .json
    └── yml/                      ← YAML browser simulation files
        └── <feature>-<scenario>.yml
```

**Naming conventions:**
- Page Objects: `camelCase.page.ts`
- Spec files: `camelCase.spec.ts`
- YAML files: `kebab-case.yml`
- Resource files: `camelCase.ts` or `camelCase.json`

---

## STEP 1 — Scan for misplaced files

1. Glob `src/tests/*.spec.ts` — spec files sitting at the root of `tests/` (must move to `ts/`)
2. Glob `src/tests/ts/*.spec.ts` — already correctly placed (report these as-is)
3. Glob `src/tests/yml/*.yml` — YAML files (should already be correct)
4. Glob `src/tests/resources/*` — resource files (should already be correct)

Report what needs to move before proceeding.

---

## STEP 2 — Move misplaced spec files

For each `.spec.ts` found directly in `src/tests/` (not in a subfolder):

1. Read the full file content
2. Update all relative import paths:
   - `from '../pages/` → `from '../../pages/`
   - `from './resources/` → `from '../resources/`
3. Write the updated content to `src/tests/ts/<filename>`
4. Delete the original file at `src/tests/<filename>`
5. If a snapshot folder exists at `src/tests/<spec>.spec.ts-snapshots/`, move it to `src/tests/ts/<spec>.spec.ts-snapshots/` using a bash `mv` command

---

## STEP 3 — Validate playwright.config.ts

Read `playwright.config.ts` and check `testDir`.

- If `testDir` is `'./src/tests'` → update it to `'./src/tests/ts'`
- If `testDir` is already `'./src/tests/ts'` → report no change needed

---

## STEP 4 — Validate yml/ and resources/ are untouched

Confirm:
- All `.yml` files remain in `src/tests/yml/`
- All resource files remain in `src/tests/resources/`

If any YAML file is found outside `src/tests/yml/`, move it there.

---

## STEP 5 — Final report

```
Structure enforced:

  src/tests/ts/          ← N spec files  ✅
  src/tests/yml/         ← N YAML files  ✅
  src/tests/resources/   ← N resource files  ✅

Files moved to ts/:
  <list of moved spec files>

Snapshot folders relocated:
  <list of moved snapshot dirs>

playwright.config.ts: testDir = './src/tests/ts'  ✅
```
