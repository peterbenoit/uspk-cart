# Segment 20: Post-Purchase Flow

## Purpose

Establish a clean and consistent post-checkout experience for the user after they complete their purchase through the BigCommerce hosted checkout.

## Goals

- Provide a "Thank You" page that confirms a successful purchase.
- Optionally display order summary information.
- Clear local cart state to prevent stale data.
- Set up a webhook (optional) to verify order confirmation.

## Tasks

- [x] Create a route `/thank-you` to serve as the destination post-checkout.
- [x] Display static confirmation messaging (e.g., “Thank you for your order!”).
- [x] Clear `cart_id` from localStorage to reset cart state.
- [ ] (Optional) Listen for BigCommerce webhook to verify the completed transaction.
- [ ] (Optional) Fetch and display order details via the Orders API if authenticated.

## Notes

- BigCommerce does not support post-checkout redirects to arbitrary URLs directly. You may use checkout settings or webhooks to notify your app of order completion.
- Webhooks can be used to capture order events (e.g., `order.created`) and update your database or trigger additional client messaging.

## Follow-ups

- Decide whether to implement guest-only checkout or support user accounts and authenticated order lookups (see Segment 19).
- Explore email confirmation options and integration with transactional email providers.
