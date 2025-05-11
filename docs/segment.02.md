### Prompt Title: Create Layout with Navigation and Static Routes

Extend the project by creating the layout and navigation for the app using JavaScript with the App Router.

---

### 🧱 Requirements

-   Inside `app/layout.js`, create a `RootLayout` component
-   Import and apply `app/globals.css`
-   Wrap all pages with:

    -   A `<html lang="en">` root
    -   A `<body>` tag
    -   A `<header>` containing a `<nav>` with links to the following routes:

        ```js
        <nav>
            <Link href="/">Home</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/category/example">Category</Link>
            <Link href="/admin">Admin</Link>
        </nav>
        ```

-   Each link should use `next/link`
-   Use basic Tailwind classes (e.g. `p-4`, `flex`, `gap-4`, `bg-gray-100`) to make it readable
-   Create placeholder pages:
    -   `app/contact/page.js`
    -   `app/admin/page.js`
    -   `app/category/example/page.js`

Each page should return a basic `<h1>` element indicating which page it is.

---

### ✅ Success Criteria

-   All links in the nav work
-   Visiting each route renders the correct content
-   Tailwind styles apply
-   Layout is visible on all pages
