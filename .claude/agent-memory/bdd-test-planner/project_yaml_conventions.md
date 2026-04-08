---
name: Project BDD YAML Conventions
description: Established YAML structure and conventions used in src/tests/yml/ scenario files
type: project
---

YAML scenario files live at src/tests/yml/ and follow this structure:

- Top-level keys: feature, description, tags, config, credentials, scenarios
- config block: browser (chromium), baseURL, headless (true)
- credentials block: username: standard_user / password: secret_sauce
- Each scenario has: id (snake_case string, NOT TC-001 numeric), title, path, page_objects, steps, validations, notes
- Steps block uses given/when/then sub-keys with bullet lists
- validations: implicit assertions not expressed in then steps
- notes: assumptions, calculation breakdowns, cross-references to other scenario files

Selector patterns observed in existing YAMLs:
- Cart badge:        [data-test="shopping-cart-badge"]
- Cart link:         [data-test="shopping-cart-link"]  (or //a[@class="shopping_cart_link"])
- Add to cart:       [data-test="add-to-cart-{slug}"]  e.g. add-to-cart-sauce-labs-backpack
- Remove from cart:  [data-test="remove-{slug}"]
- Cart items:        .cart_item
- Subtotal label:    .summary_subtotal_label  (also [data-test="subtotal-label"])
- Tax label:         .summary_tax_label       (also [data-test="tax-label"])
- Total label:       .summary_total_label     (also [data-test="total-label"])
- Page title:        .title
- Checkout button:   [data-test="checkout"] or #checkout
- Continue button:   [data-test="continue"]
- Finish button:     [data-test="finish"]
- Error message:     [data-test="error"]
- Sidebar logout:    #logout_sidebar_link  (NavbarPage uses ${option}_sidebar_link pattern)

Tags in use: @smoke, @regression, @positive, @negative, @alternative, @cart, @checkout, @login

**Why:** Consistency with existing files allows the YAML to be parsed/executed uniformly.
**How to apply:** Always align new scenario files to these conventions; do not invent new top-level keys.
