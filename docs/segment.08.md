### Prompt Title: Enable Product Editing from Admin Panel

Add the ability to edit a product's name and category from the admin page using client-side interaction and Supabase updates.

---

### 🧱 Requirements

#### Editable Admin UI

-   Update `app/admin/page.js`:
    -   Render products with an “Edit” button next to each one
    -   Clicking “Edit” toggles an inline form to change the product’s name and category
    -   Include a “Save” button to submit changes

#### Supabase Hookup

-   Update `lib/products.js`:
    -   Add a `updateProduct(id, updates)` function that uses Supabase to persist changes

#### Form Handling

-   Use client-side state (e.g. `useState`) to manage the edit form
-   On save, call `updateProduct()` and refresh the list

---

### ✅ Success Criteria

-   Admin page displays edit buttons
-   Editing and saving updates the product via Supabase
-   Form validation and error handling are not required at this stage
