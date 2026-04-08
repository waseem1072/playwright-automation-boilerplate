---
name: Planned Scenarios Index
description: Running index of all BDD scenario IDs that have been planned, by feature area
type: project
---

## Login (src/tests/yml/login.yml)
- Covered in login.yml — existing file, not yet catalogued here.

## Checkout (src/tests/yml/checkout.spec.yml)
- checkout_single_item          — single item happy path, @smoke @positive
- checkout_multiple_items       — two items (Backpack + Bike Light), @regression @positive
- checkout_missing_first_name   — @regression @negative
- checkout_missing_last_name    — @regression @negative
- checkout_missing_postal_code  — @regression @negative
- checkout_all_fields_empty     — @regression @negative
- cancel_checkout_returns_to_cart         — @regression @alternative
- cancel_overview_returns_to_inventory    — @regression @alternative
- remove_item_from_cart_before_checkout   — @regression @alternative
- back_button_from_checkout_step_one      — @regression @alternative

## Multi-Item Cart and Total (src/tests/yml/multi-item-cart-and-total.yml)
- cart_count_matches_items_added          — three items, badge + .cart_item count, @regression @positive
- checkout_total_calculation_three_items  — three items, subtotal/tax/total math, @regression @positive

## Logout (src/tests/yml/logout.yml)
- Covered in logout.yml — existing file, not yet catalogued here.

## Filters (src/tests/yml/filter-name-a-z.yml, filter-name-z-a.yml)
- Covered in filter YAMLs — existing files, not yet catalogued here.

## Playwright.dev Navigation (src/tests/yml/)
- playwrightdev_get_started_navigation  — click Get Started on homepage, assert URL + title, @smoke @positive (get-started-happy-path.yml)

## Playwright.dev Docs Sidebar (src/tests/yml/)
- TC-005  — click "Web server" sidebar link from /docs/intro, assert URL + h1 + title, @docs @smoke @positive (docs-web-server.yml)

## Playwright.dev Boundary Value Tests (src/tests/yml/boundary-value-tests.yml)
- TC-006  — language selector, switch to Python (first non-default), @boundary @docs @smoke @positive
- TC-007  — language selector, switch to .NET (last option), @boundary @docs @regression @positive
- TC-008  — search modal opens with empty input (zero-length boundary), @boundary @docs @smoke @positive
- TC-009  — search input accepts 100-char query without truncation, @boundary @docs @regression @positive
- TC-010  — dark mode off-to-on toggle (lower boundary), @boundary @docs @smoke @positive
- TC-011  — dark mode on-to-off toggle (upper boundary / round-trip), @boundary @docs @regression @positive
- TC-012  — docs sidebar first link 'Writing tests' visible and navigable, @boundary @docs @smoke @positive
- TC-013  — docs sidebar deep link 'Annotations' visible and navigable, @boundary @docs @regression @positive

**Why:** Tracking planned IDs prevents duplication across planning sessions.
**How to apply:** Before generating new scenarios, check this index and avoid IDs that already exist. Next available ID is TC-014.
