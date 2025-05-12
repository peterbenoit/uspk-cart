# Segment 21: Customer Order History & Address Management

## Purpose

Extend the customer experience by enabling users to view past orders and manage their shipping/billing addresses.

## Goals

- Allow authenticated users to view their previous orders.
- Provide a page or dashboard for managing saved addresses.
- Support updating or deleting addresses.

## Tasks

- [ ] Create a page at `/account/orders` that fetches and displays the customer’s past orders.
- [ ] Create a page at `/account/addresses` to manage saved shipping/billing addresses.
- [ ] Use BigCommerce Customer API or Storefront GraphQL API to:
    - Retrieve order list with dates, totals, and statuses.
    - Fetch address list and display formatted entries.
    - Add/update/delete addresses via secure form submission.
- [ ] Require customer to be logged in to access these pages.

## Notes

- BigCommerce separates billing and shipping addresses.
- For security, do not expose full order details unless authenticated and matched to session.
- UI should match existing branding and layout.

## Follow-ups

- Segment 22: Allow customer profile updates (email, name, etc).
- Segment 23+: Optional wishlist or saved items functionality.
