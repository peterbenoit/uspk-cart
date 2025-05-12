# Segment 14c: Guest vs. Authenticated Checkout Flow

## Purpose

Determine how the user transitions from cart to checkout, depending on whether they are logged in or checking out as a guest.

## Goals

- Redirect users from `/cart` to BigCommerce’s `checkout_url`
- Optionally pre-fill known customer data (if authenticated)
- Decide when to prompt for login (or defer to BigCommerce)

## Tasks

- [ ] On "Proceed to Checkout" button click, redirect user to the `checkout_url` returned by BigCommerce
- [ ] If the user is logged in, ensure email and address information are stored in BigCommerce customer profile
- [ ] If not logged in, allow guest checkout with the current cart contents
- [ ] Optionally display a login/signup prompt prior to redirect
- [ ] Ensure cart ID is preserved until order is complete (do not clear prematurely)

## Notes

- BigCommerce checkout URLs are session-specific and expire
- Redirect must occur within a user-initiated click event to avoid popup blockers
- Actual authentication and account management are handled in later segments

## Follow-ups

- Segment 15: Build user login/signup flow
- Segment 16: Store customer metadata in Supabase for parallel tracking
