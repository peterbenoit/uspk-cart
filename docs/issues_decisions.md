# Issues and Decisions Log

This document tracks critical issues encountered and decisions made across the project timeline for consistency and traceability.

---

## Tailwind CSS v4 Setup

**Issue:** Tailwind v4 removed `@tailwind base/components/utilities` and no longer supports `tailwindcss init`.

**Decision:** Use `@import "tailwindcss";` in `globals.css` and follow official Next.js setup instructions. Do not use `npx tailwindcss init`.

---

## Dynamic Route Parameters in Next.js 15

**Issue:** Accessing `params.id` or `params.slug` synchronously caused hydration warnings and build failures due to Next.js 15's sync-dynamic-apis policy.

**Decision:** Await `params` as a promise and destructure its contents inside the function body:

```js
export default async function Page({ params }) {
    const resolvedParams = await params;
    const id = resolvedParams.id;
}
```

---

## Public Supabase Key and Auth

**Issue:** Confusion between `NEXT_PUBLIC_SUPABASE_ANON_KEY` and user credentials.

**Decision:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to expose and used only to initialize the client. Actual authentication is performed with `supabase.auth.signInWithPassword({ email, password })`.

---

## Supabase Product Table and RPC Functions

**Issue:** Supabase table was initially hardcoded; field coverage was insufficient.

**Decision:** Create a normalized `products` table with fields: `id`, `name`, `category`, `description`, `price`, `image_url`, `stock`, `created_at`, `updated_at`.

**Issue:** Frontend was manually inserting/updating products.

**Decision:** Replace direct client-side inserts with RPC functions:

-   `get_all_products()`
-   `get_product_by_id(pid)`
-   `create_product(...)`
-   `update_product(...)`
-   `delete_product(pid)`

---

## Segment Prompt Consistency

**Issue:** AI agents implemented logic inconsistently.

**Decision:** Update each segment to:

-   Use shared product utilities like `getAllProducts()`
-   Reference Supabase RPC functions when applicable
-   Match database schema
-   Clarify field requirements (e.g. `price`, `stock`)

---

## Admin Interface Data Handling

**Issue:** Products list in admin was hardcoded even after DB setup.

**Decision:** Admin UI should use `getAllProducts()` and call `update_product` via Supabase RPC.

---

## Testing Guidance

**Issue:** AI-generated pages lacked discoverability or test pathways.

**Decision:** Pages must include links to related pages (e.g. category lists linking to product detail pages) for verification without typing URLs manually.
