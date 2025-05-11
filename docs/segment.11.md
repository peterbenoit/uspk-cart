### Prompt Title: Add Basic UI Enhancements and Component Extraction

Improve the visual clarity of the app and extract the navigation header into its own component.

---

### 🧱 Requirements

#### Header Component

-   Create `components/Header.js`
-   Move the `<header>` and `<nav>` from `app/layout.js` into this file
-   Export a `Header` component
-   Import and render `<Header />` inside `layout.js`

#### Visual Enhancements

-   Apply Tailwind styling improvements to:
    -   Navigation (`flex`, `hover`, spacing, border)
    -   Forms (`rounded`, `bg-gray-100`, `focus:outline-none`)
    -   Tables or product lists (`striped rows`, `hover effects`)
-   Ensure spacing and font weights are used consistently

---

### ✅ Success Criteria

-   Header is rendered from a separate component
-   Visual presentation of pages is more polished
-   Tailwind classes are used effectively but not excessively
