### Prompt Title: Add Category Routing and Mock Product Listing

Create a dynamic category page that renders based on the `[slug]` in the URL and displays a list of mock products filtered by category.

---

### 🧱 Requirements

#### Dynamic Routing

-   Create `app/category/[slug]/page.js`
-   Read `params.slug` from the incoming props
-   Display a heading like: `Products in: {slug}`

#### Mock Product Data

-   In `lib/products.js`, export a list of products:
    ```js
    export const products = [
        { id: '1', name: 'Tactical Backpack', category: 'gear' },
        { id: '2', name: 'Rangefinder', category: 'optics' },
        { id: '3', name: 'First Aid Kit', category: 'gear' },
        { id: '4', name: 'Shooting Glasses', category: 'safety' },
    ];
    ```
-   Create a function `getProductsByCategory(slug)` that returns matching items

#### Page Output

-   In `[slug]/page.js`, use the function to load matching products
-   Map the results into a basic list (`<ul><li>{product.name}</li></ul>`)

---

### ✅ Success Criteria

-   Visiting `/category/gear` shows only gear products
-   Visiting `/category/optics` shows only optics products
-   Works without client-side JS
-   No API routes needed yet (static filtering only)
