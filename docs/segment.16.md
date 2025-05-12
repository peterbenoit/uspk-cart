# Segment 16: Update & Remove Cart Items

## Purpose

Allow users to modify the quantity of items in their cart or remove items entirely, using BigCommerce’s Cart API.

## Goals

- Provide quantity input controls in the cart view.
- Allow item removal with a dedicated button or link.
- Reflect changes in the cart total and local state.

## Tasks

- [ ] In the `/cart` page, add UI for adjusting quantity of each item.
- [ ] Add “Remove” action for each cart item.
- [ ] On quantity change, call `updateCartItem(cartId, itemId, quantity)`.
- [ ] On removal, call `removeFromCart(cartId, itemId)`.
- [ ] Update local state and re-render cart totals accordingly.
- [ ] Handle edge cases like setting quantity to zero or invalid input.

## Notes

- Make sure updates are debounced or confirmed to avoid excessive API calls.
- Show loading or disabled states during update/removal actions.
- Prevent interaction if cart is invalid or expired.

## Follow-ups

- Segment 17: Handle stale or expired cart scenarios gracefully.
- Segment 18: Redirect to hosted checkout.
