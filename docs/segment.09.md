### Prompt Title: Add New Product Creation Form to Admin Panel

Extend the admin page to allow adding new products to the mock product list using Supabase.

---

### 🧱 Requirements

#### Admin UI

-   At the top of `app/admin/page.js`, add a “New Product” form:
    -   Fields: `name`, `category`, and `description`
    -   Submit button labeled “Add Product”

#### Supabase Hookup

-   In `lib/products.js`, add a function:

    ```js
    export async function createProduct(data) {
        return await supabase.from('products').insert([data]);
    }
    ```

-   On form submit, call `createProduct()` with the new product data
-   Refresh the product list after successful insert

#### Notes

-   You may pre-fill the product ID with `Date.now().toString()` or let Supabase autogenerate it
-   No validation or error handling required

---

### ✅ Success Criteria

-   Admins can add a product with name, category, and description
-   New products appear in the product list on the same page
-   Product data is stored in Supabase (no local mock updates)
