### Prompt Title: Create Mock Product API Layer for Inventory-less Testing

Set up a local, mock API simulation layer to support testing of pages without relying on real Supabase or BigCommerce inventory data.

---

### 🧱 Requirements

#### Fallback Data Layer

-   In `lib/products.js`, define a `USE_MOCK_DATA` flag:

    ```js
    const USE_MOCK_DATA = true;
    ```

-   Conditionally export functions using either mock data or Supabase/BigCommerce:

    ```js
    export async function getProductsByCategory(category) {
        if (USE_MOCK_DATA) return MOCK_PRODUCTS.filter((p) => p.category === category);
        // Otherwise: fetch from Supabase or BigCommerce
    }
    ```

-   Define `MOCK_PRODUCTS` in the same file or import it

#### Add a Toggle Option (Optional)

-   In `.env.local.example`, document:
    ```env
    USE_MOCK_DATA=true
    ```
-   In your app, use `process.env.USE_MOCK_DATA` to toggle sources

---

### ✅ Success Criteria

-   The app builds and runs fully with mock data only
-   No Supabase or BigCommerce setup is required to test the UI
-   When `USE_MOCK_DATA` is `false`, real fetch logic becomes active
