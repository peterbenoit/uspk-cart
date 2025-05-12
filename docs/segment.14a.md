# Segment 14a: Implement Cart Page

## Purpose

Expose the current BigCommerce cart to the user at the `/cart` route. This allows visual inspection of cart contents and initiates checkout.

## Goals

- Display items added to the cart
- Show subtotal and item count
- Provide a "Proceed to Checkout" button

## Tasks

- [ ] Create `app/cart/page.js` route
- [ ] In `page.js`, access `cart_id` from `localStorage` using a client component
- [ ] Fetch the current cart via `getBigCommerceCart(cartId)`
- [ ] Display each line item:
    - Product image
    - Name
    - Quantity (read-only for now)
    - Price
- [ ] Display subtotal and item count at the bottom
- [ ] Add a button to redirect to BigCommerce `checkout_url`
- [ ] Show empty cart state if no cart or no line items

## Notes

- Quantity updates and item removal are reserved for a future segment
- You may use a simplified card layout or reuse existing `ProductCard` component with cart-specific styling
- Consider handling error/loading states gracefully

## Follow-ups

- Segment 14b: Enable quantity editing and item removal
- Segment 14c: Handle guest checkout vs. authenticated user flow
