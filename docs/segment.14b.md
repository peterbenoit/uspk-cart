# Segment 14b: Cart Quantity Editing & Item Removal

## Purpose

Enhance the `/cart` page with functionality to update item quantities and remove products from the cart.

## Goals

- Allow users to increment/decrement product quantities
- Allow users to remove items from the cart entirely
- Reflect changes in both BigCommerce and the UI

## Tasks

- [ ] Update the cart page UI to include +/- buttons for quantity next to each item
- [ ] Add a “Remove” button or link for each item
- [ ] Use `updateBigCommerceCartItemQuantity(cartId, itemId, quantity)` to adjust quantity
- [ ] Use `removeItemFromBigCommerceCart(cartId, itemId)` to delete item
- [ ] Display confirmation or loading indicator while changes apply
- [ ] Refresh cart state after each mutation to ensure sync with BigCommerce

## Notes

- You may debounce quantity updates to reduce API calls
- Prevent quantity going below 1 (or remove if set to 0)
- Changes must reflect immediately for a seamless UX

## Follow-ups

- Segment 14c: Confirm cart-to-checkout behavior under login/guest modes
