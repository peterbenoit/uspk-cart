# Segment 16a: Add to Cart Integration with BigCommerce

## Purpose

Implement the actual mechanism for adding items to the BigCommerce cart from product displays and detail pages.

## Goals

- Allow users to add products to their cart using real BigCommerce cart API integration
- Maintain or create a cart ID as needed and store it locally
- Update the cart state after a successful addition
- Provide visual confirmation that an item has been added

## Tasks

- [ ] Add “Add to Cart” button to each product card and product detail page
- [ ] On click, call `addItemToBigCommerceCart(productId, quantity)`
- [ ] If no cart exists, create one and persist its ID to localStorage
- [ ] Refresh cart state after successful mutation
- [ ] Show feedback (toast, inline message, badge update, etc.)

## Notes

- Button should default to quantity of 1
- Prevent duplicate adds if already in cart (optional but recommended)
- Do not allow interaction while the mutation is pending

## Follow-ups

- Segment 17: Cart badge and mini cart interactions
