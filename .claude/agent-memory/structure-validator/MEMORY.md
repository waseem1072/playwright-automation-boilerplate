# Structure Validator — Agent Memory Index

- [Project Structure](project_structure.md) — Confirmed layout: specs in src/tests/ts/, pages in src/pages/, YAMLs in src/tests/yml/, resources in src/tests/resources/
- [Stray Root Artifacts](project_stray_artifacts.md) — Recurring issue: YAML/screenshot artifacts get left at project root during pipeline runs
- [Page Objects](project_page_objects.md) — Three active page objects: playwrightHome, playwrightDocs, playwrightCommunity; all follow PascalCase class + camelCase.page.ts file naming
- [Spec File Conventions](project_spec_conventions.md) — All specs use storageState override, array-form screenshots, and @docs + polarity tags; e2e.spec.ts uses @regression not @smoke
- [Config State](project_config.md) — playwright.config.ts: testDir=./src/tests, baseURL=https://playwright.dev/, fullyParallel=false, no setup project; teamsReporter hardcodes webhook URL
