### Prompt Title: Add New Product Creation Form to Admin Panel

Extend the admin page to allow adding new products to the mock product list using Supabase.

---

### 🧱 Requirements

#### Admin UI

- At the top of `app/admin/page.js`, add a “New Product” form:
    - Fields: `name`, `category`, `description`, `price`, `image_url`, and `stock`
    - Submit button labeled “Add Product”

#### Supabase Hookup

- In `lib/products.js`, add a function:

    ```js
    export async function createProduct(data) {
        return await supabase.rpc('create_product', {
            pname: data.name,
            pcategory: data.category,
            pdescription: data.description,
            pprice: data.price,
            pimage_url: data.image_url,
            pstock: data.stock,
        });
    }
    ```

- On form submit, call `createProduct()` with all fields from the form
- Refresh the product list after successful insert

#### Notes

- You may pre-fill the product ID with `Date.now().toString()` or let Supabase autogenerate it
- No validation or error handling required

---

### ✅ Success Criteria

- Admins can add a product with name, category, and description
- New products appear in the product list on the same page
- Product data is stored in Supabase (no local mock updates)
