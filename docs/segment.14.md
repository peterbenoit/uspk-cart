# Segment 14: BigCommerce Cart API Integration

## Purpose

Replace the client-only cart functionality with real-time, server-synced cart management via BigCommerce's Cart API.

## Goals

- Create a cart on BigCommerce if one doesn't exist.
- Add items to the cart using BigCommerce’s API.
- Store and persist the `cart_id` in localStorage.
- Maintain compatibility with existing `useCart` interface.

## Tasks

- [ ] Create utility functions for:
    - `createCart(items)`
    - `addToCart(cartId, items)`
    - `getCart(cartId)`
    - `removeFromCart(cartId, itemId)`
    - `updateCartItem(cartId, itemId, quantity)`
- [ ] Replace stubbed cart methods in `useCart` with real API calls.
- [ ] On app load, check localStorage for existing `cart_id`. If present, fetch cart; otherwise, create a new one.
- [ ] Handle errors when cart has expired (e.g., invalid `cart_id`).
- [ ] Display total item count and subtotal via API.

## Notes

- BigCommerce deletes carts after ~30 days of inactivity.
- Error-handling should gracefully fall back to creating a new cart if the current one is expired or invalid.
- Cart visibility (icon, badge) should reflect current state accurately.

## Follow-ups

- Segment 15: Display the cart and its items on a dedicated page.
- Segment 16: Allow cart item updates and removal.
