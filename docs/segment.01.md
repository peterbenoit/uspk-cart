### Prompt Title: Scaffold Project with Tailwind CSS (JavaScript, App Router)

Initialize a new e-commerce template project using **Next.js (JavaScript)** with the **App Router**, without TypeScript.

---

### 🧱 Requirements

-   Use `npx create-next-app@latest` with these flags:
    ```bash
    npx create-next-app@latest . --js --app --no-src --tailwind --eslint --import-alias="@/*" --no-experimental-app
    ```
-   Do **not** enable experimental features (no Turbopack, no Server Actions)
-   Once initialized, install and configure Tailwind CSS:

    ```bash
    npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss
    ```

    > Tailwind CSS v4 no longer includes the `init` CLI. Do not run `npx tailwindcss init`. Tailwind must be used via PostCSS using the `@tailwindcss/postcss` plugin.

-   Create `postcss.config.js` with the following content:

    ```js
    module.exports = {
        plugins: {
            '@tailwindcss/postcss': {},
            autoprefixer: {},
        },
    };
    ```

-   Update `tailwind.config.js`:

    ```js
    module.exports = {
        content: ['./app/**/*.{js,jsx}'],
        theme: {
            extend: {},
        },
        plugins: [],
    };
    ```

-   Create `app/globals.css` and include:

    ```css
    @import 'tailwindcss';
    ```

-   Import `globals.css` into `app/layout.js`

---

### ✅ Success Criteria

-   `npm run dev` starts successfully
-   Visiting `http://localhost:3000` renders the homepage
-   Tailwind utility classes work when used in `app/page.js`
-   No hydration, CLI, or lint errors at this stage
