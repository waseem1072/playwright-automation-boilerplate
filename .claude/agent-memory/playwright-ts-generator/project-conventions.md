---
name: Project Conventions
description: Confirmed patterns for auth, structure, tags, and assertions used across saucedemo Playwright specs
type: project
---

## Auth / beforeEach pattern

Tests rely on global auth setup (`global.setup.ts` saves to `.auth/user.json`). Do NOT call `LoginPage.login()` in specs — instead navigate directly:

```ts
test.beforeEach(async ({ page }) => {
  productPage = new ProductPage(page);
  cartPage = new ShoppingCartPage(page);
  await page.goto("/inventory.html");
  await expect(page.locator(".title")).toHaveText("Products");
});
```

## afterEach teardown pattern

Always reset to `/inventory.html` so subsequent tests start clean:

```ts
test.afterEach(async ({ page }) => {
  await page.goto("/inventory.html");
});
```

## Tag placement

Tags go in the second argument object AND inline in the test title string:

```ts
test(
  "descriptive name @cart",
  { tag: ["@regression", "@positive"] },
  async ({ page }) => { ... }
);
```

Feature/area tags (e.g., `@cart`, `@checkout`, `@login`) go in the test title string.
Suite-level tags (`@regression`, `@positive`, `@negative`) go in the `{ tag: [...] }` object.

## Assertion styles

- Playwright locator/URL assertions: `await expect(locator).toHaveText(...)` / `await expect(page).toHaveURL(...)`
- Non-Playwright return values: `expect(await somePageObjectMethod()).toBe(value)`

## Page object method signatures (confirmed)

- `ProductPage.addToCart(productName: string)` — XPath-based, uses product display name
- `ProductPage.getShoppingCartBadge(): Promise<string>` — returns badge text
- `ProductPage.clickOnShoppingCartLink()` — navigates to /cart.html
- `ShoppingCartPage.getCartItemCount(): Promise<number>` — counts `.cart_item` elements
- `ShoppingCartPage.getItemTotal(): Promise<string>` — returns full label text, e.g. "Item total: $55.97"
- `ShoppingCartPage.getTax(): Promise<string>` — e.g. "Tax: $4.48"
- `ShoppingCartPage.getOrderTotal(): Promise<string>` — e.g. "Total: $60.45"

## Three-item totals (verified values for Backpack + Bike Light + Bolt T-Shirt)

- Item total: $55.97 ($29.99 + $9.99 + $15.99)
- Tax (8%): $4.48
- Grand total: $60.45

**Why:** These values were locked in during multi-item-cart.spec.ts generation and confirmed against the YAML spec.
**How to apply:** Use as reference when writing or reviewing checkout total assertions for this specific item combination.
