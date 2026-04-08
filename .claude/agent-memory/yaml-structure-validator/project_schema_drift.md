---
name: Browser-Action YAML Schema Drift
description: All browser-action YAML files in this project use a non-standard name/config/steps structure instead of the required feature/baseURL/steps schema
type: project
---

All 7 browser-action YAML files in `src/tests/yml/` (as of 2026-04-07) use a divergent schema:
- Root key is `name` instead of required `feature`
- `baseURL` is nested under a `config` block instead of being a root-level key
- `baseURL` values use `https://playwright.dev` without a trailing slash (project standard is `https://playwright.dev/`)
- Assertions are inlined as `assertions:` sub-lists within `goto`/`click` steps, not expressed as independent `- action: assert` steps

Affected files: `homepage-loads.yml`, `get-started-happy-path.yml`, `nav-docs.yml`, `nav-api.yml`, `nav-community.yml`, `docs-writing-tests.yml`, `web-server-happy-path.yml`

**Why:** Likely schema evolution — earlier files were produced before the project standardised on `feature`/`baseURL`/`steps` top-level keys. The `config` block pattern was the old looser format.

**How to apply:** When validating any browser-action YAML, always check for these three issues first as a batch — they will be present in any file generated under the old schema. Flag them as ERRORs. When new files are generated, ensure they conform to the standard schema.
