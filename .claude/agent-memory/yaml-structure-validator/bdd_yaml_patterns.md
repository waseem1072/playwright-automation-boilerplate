---
name: BDD YAML Patterns and Conventions
description: Observed structural patterns in BDD YAML files, approved tags, and known extra-field conventions
type: project
---

## Approved Tags (observed in validated files)
- `@docs` — all playwright.dev tests
- `@smoke` — smoke suite
- `@positive` — happy-path polarity
- `@regression` — regression suite (approved but not yet seen in current file set)

## BDD YAML Extra Fields Convention
`docs-web-server.yml` uses several non-standard extra fields within scenario items:
- `id` (e.g., `"TC-005"`) — test case identifier
- `path` (e.g., `"happy-path"`) — scenario path classification
- `page_objects` — list of page object class names referenced
- `validations` — additional post-condition checks beyond `then`
- `notes` — free-text annotation block

These are not part of the required BDD schema but are present in at least one validated file. They are silently ignored by `bdd-test-planner`. They should be flagged as WARNING (non-standard) but are not blocking.

## Stale Notes Warning
`docs-web-server.yml` contained a note claiming `PlaywrightDocsPage` lacked a `webServerHeading` getter — this was false as of 2026-04-07. The getter exists at line 50 of `playwrightDocs.page.ts`. Always verify page object claims in BDD YAML notes against the current source file before treating them as valid.

## Tags Placement
In `docs-web-server.yml`, tags are placed at the top level (under `feature`), not within each scenario item. This is an acceptable variant — the standard schema does not mandate per-scenario tags, and top-level tags apply to all scenarios in the file.
