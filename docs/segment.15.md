# Segment 15: Cart View Page

## Purpose

Create a dedicated page to display the user's current cart contents, using data from the BigCommerce Cart API.

## Goals

- Show all items in the user's current cart.
- Provide key details: product name, quantity, price, subtotal.
- Enable navigation to checkout from the cart page.

## Tasks

- [ ] Create a new page at `/cart`.
- [ ] Retrieve cart contents using the stored `cart_id` and the BigCommerce API.
- [ ] Display a list of products with:
    - Product name
    - Product image (if available)
    - Unit price
    - Quantity
    - Item subtotal
- [ ] Display cart total at the bottom.
- [ ] Show “Go to Checkout” button linking to BigCommerce’s hosted checkout.

## Notes

- Cart data should come from `getCart(cartId)` created in Segment 14.
- If cart is expired or not found, display a friendly error and prompt to return to products.

## Follow-ups

- Segment 16: Enable quantity updates and item removal in the cart.
- Segment 18: Implement the checkout redirection flow.
