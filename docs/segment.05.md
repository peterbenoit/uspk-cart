### Prompt Title: Create Product Detail Page with Static Rendering

Add support for displaying individual product detail pages using static routing and mock data.

---

### 🧱 Requirements

#### Dynamic Product Page

- Create `app/product/[id]/page.js`
- Read `params.id` from the props
- Use it to fetch a single product from `lib/products.js`

#### Extend Mock Product Data

- In `lib/products.js`, add a new function:
    ```js
    export function getProductById(id) {
        return products.find((product) => product.id === id);
    }
    ```
- Add a `description` field to each product:
    ```js
    {
      id: '1',
      name: 'Tactical Backpack',
      category: 'gear',
      description: 'Durable backpack designed for outdoor tactical use.'
    }
    ```

#### Product Detail Output

- Display the product name, description, and category
- Show a message if the product is not found

---

### ✅ Success Criteria

- Visiting `/product/1` shows the Tactical Backpack
- Visiting `/product/999` shows a “Product not found” message
- Make sure there are links available for me to test with
- No API routes or database access used
