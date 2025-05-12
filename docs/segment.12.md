# Segment 12: Add to Cart UI

## Purpose

Introduce a user interface to allow adding products to a shopping cart. This will be the first visual and interactive step in the cart flow.

## Goals

- Render an “Add to Cart” button on product cards and individual product pages.
- Stub out a local `addToCart(productId, quantity)` method.
- Avoid any backend or BigCommerce logic for now — this is strictly UI setup.

## Tasks

- [ ] Create a reusable `<AddToCartButton />` component that accepts a `productId` and optional `quantity` prop.
- [ ] Render `<AddToCartButton />` inside product card and product detail views.
- [ ] Clicking the button should trigger a placeholder function (e.g., console.log or alert).
- [ ] Design should be consistent with the rest of the UI (Tailwind-based, minimal).
- [ ] Include basic disabled/loading state if needed.

## Notes

- No cart state or persistence is introduced in this segment — that will be handled in Segment 13.
- Use `data-testid` or similar attributes where helpful for future testing.

## Follow-ups

- Segment 13: Introduce client-side cart state management using context.
- Segment 14: Integrate with BigCommerce Cart API and store cart ID in localStorage.
