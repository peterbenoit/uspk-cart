# Segment 13: Basic Cart State (Client-side Only)

## Purpose

Enable cart functionality in the app without depending on BigCommerce. This segment will manage cart data locally using React Context or localStorage.

## Goals

- Create a central cart state accessible throughout the app.
- Allow products to be added to, removed from, and updated within the cart.
- Store cart in localStorage for session persistence.

## Tasks

- [ ] Create a `CartProvider` context to wrap the app.
- [ ] Implement `useCart()` hook to expose cart manipulation methods:
    - `addToCart(productId, quantity)`
    - `removeFromCart(productId)`
    - `updateQuantity(productId, quantity)`
    - `clearCart()`
- [ ] Initialize cart state from localStorage on load.
- [ ] Store updates back into localStorage after changes.
- [ ] Display total items in cart icon in the header.

## Notes

- This is a temporary layer to simulate cart operations.
- Will be replaced or abstracted in Segment 14 with BigCommerce integration.

## Follow-ups

- Segment 14: Replace local operations with BigCommerce Cart API.
- Segment 15: Create cart view page and display items with quantity controls.
