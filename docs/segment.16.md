### Prompt Title: Fetch Live Products from BigCommerce

Start integrating BigCommerce product data by replacing mock product logic with real data from the BigCommerce API.

---

### 🧱 Requirements

#### Product API Hookup

-   In `lib/products.js`, update `getProductsByCategory(category)`:

    -   If `USE_MOCK_DATA` is `true`, return filtered `MOCK_PRODUCTS` as before
    -   If `false`, make a GET request to:
        ```
        /catalog/products?include=custom_fields,images&is_visible=true
        ```
        using the configured BigCommerce API client

-   Filter results client-side by category using `product.categories` if needed

#### Usage in Category Page

-   In `app/category/[slug]/page.js`, keep using `getProductsByCategory(slug)`
-   No changes to the component output—just replace data at the source

---

### ✅ Success Criteria

-   When `USE_MOCK_DATA=false`, product data comes from BigCommerce
-   Products are filtered by category (match mock behavior)
-   App renders without error regardless of data source
