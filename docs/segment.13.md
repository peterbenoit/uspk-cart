### Prompt Title: Add Metadata and Not Found Handling

Improve the app's SEO and user experience by defining route-level metadata and a global 404 page.

---

### 🧱 Requirements

#### Metadata

-   For each of these routes, add a `metadata` export in their respective `page.js` files:
    -   `/` → title: “Home – NextJS Commerce Template”
    -   `/contact` → title: “Contact Us”
    -   `/admin` → title: “Admin Dashboard”
    -   `/category/[slug]` → dynamic title based on `params.slug`
    -   `/product/[id]` → dynamic title based on product name (if available)

Example:

```js
export const metadata = {
    title: 'Contact Us',
};
```

-   Use a `generateMetadata()` function for `[slug]` and `[id]` routes

#### Not Found Page

-   Create `app/not-found.js`
-   Render a simple custom 404 message:

    ```jsx
    export default function NotFound() {
        return <h1 className="text-center mt-12 text-2xl">404 – Page Not Found</h1>;
    }
    ```

-   In `[slug]` and `[id]` routes, if no product/category is found, call `notFound()` from `next/navigation`

---

### ✅ Success Criteria

-   Metadata titles render per page
-   Invalid product or category routes show the custom 404
-   SEO basics are in place without runtime errors
