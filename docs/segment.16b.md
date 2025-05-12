# Segment 16b: Secure Add to Cart via Local API Route

## Objective

Implement a secure server-side mechanism to add items to the BigCommerce cart by introducing a local API route. This avoids exposing BigCommerce credentials to the client and ensures robust integration.

## Tasks

### 1. Create Local API Route

- Create a POST route at `/api/cart/add`
- The route should:
    - Accept a JSON payload: `{ productId, quantity, variantId }`
    - Use the existing `addItemToCart` method from `bigcommerceClient.js`
    - Return the updated cart state or confirmation

### 2. Update Frontend Cart Context

- In `cart.js`, modify `addToCart` to:
    - Use `fetch('/api/cart/add', { method: 'POST', body: JSON.stringify(...) })`
    - Await and return the response
    - Handle success and failure gracefully

### 3. Ensure Environment Safety

- Ensure the API route reads the BigCommerce API credentials from `process.env` and does not expose any secrets to the client.

### 4. Add Error Handling

- Log errors to console on the server if the BigCommerce API fails
- Display error messages or fallback behavior on the frontend if add-to-cart fails

## Notes

- This segment assumes cart creation and cart ID management is already handled in previous segments or within `bigcommerceClient.js`.
- This completes the integration from product display to server-authenticated cart mutation.
