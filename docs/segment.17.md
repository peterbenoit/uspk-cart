# Segment 17: Handle Expired or Stale Cart

## Purpose

Ensure users do not encounter a broken experience when their cart becomes invalid due to timeouts or backend changes on BigCommerce.

## Goals

- Detect when the stored cart ID no longer resolves via the API.
- Prompt the user with a message and recover gracefully.
- Automatically create a new cart if necessary.

## Tasks

- [ ] Enhance `getCart(cartId)` to detect 404 or 403 errors and return null.
- [ ] In cart page and `useCart`, check for `null` response and:
    - Display an error message like "Your cart has expired."
    - Clear the invalid cart ID from localStorage.
    - Prompt to start a new cart session (e.g., redirect to home or products).
- [ ] Add logic to automatically re-create a cart if the current one fails and the user tries to add an item.

## Notes

- BigCommerce carts are deleted after ~30 days or in some edge cases after inactivity.
- Handling this proactively avoids broken states and preserves UX integrity.

## Follow-ups

- Segment 18: Trigger BigCommerce’s hosted checkout flow.
