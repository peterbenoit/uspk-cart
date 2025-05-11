### Prompt Title: UI and Component Polish Pass

Apply visual and structural refinements across the app for a more polished and consistent user interface.

---

### 🧱 Requirements

#### Component Reuse and Cleanup

-   Extract any duplicated form field elements (e.g., input groups, labeled fields) into small components like `components/FormField.js`
-   Create `components/Button.js` if you have repeated Tailwind button classes

#### Global Layout Improvements

-   Adjust spacing and padding for consistency across pages
-   Use a consistent heading size (`text-2xl font-semibold`, etc.)
-   Add `max-w-3xl mx-auto` containers where appropriate to constrain layout width

#### Accessibility and UX

-   Ensure all form inputs have associated `<label>` elements
-   Add `aria-label` attributes to nav links if needed
-   Use `focus:outline-none focus:ring` on inputs/buttons

#### Visual Detail

-   Use Tailwind colors and classes for better contrast and legibility
-   Ensure all pages have visible page-level headings
-   Optional: add a subtle hover effect to nav links and product rows

---

### ✅ Success Criteria

-   Components look cleaner and are easier to maintain
-   Layouts feel consistent and responsive
-   Forms and UI elements are more accessible
-   All reusable UI patterns are moved to components
