---
name: User Role and Context
description: User is a QA engineer building BDD test plans for a Playwright/TypeScript project against playwright.dev
type: user
---

User is a QA engineer (or test architect) working on a Playwright + TypeScript automation project
against playwright.dev (the project has migrated away from saucedemo.com — all active test authoring
targets playwright.dev). They provide informal user stories, acceptance criteria, or structured
boundary/scenario lists and expect back structured YAML BDD test plans aligned with the project's
page object model and existing YAML conventions. They are comfortable reading test YAML and
Playwright TypeScript — responses should assume test-engineer fluency, not beginner explanations.

The user's project uses two page objects: PlaywrightHomePage and PlaywrightDocsPage. Tests are
tagged @docs @smoke/@regression @positive/@negative and now also @boundary for boundary value suites.
