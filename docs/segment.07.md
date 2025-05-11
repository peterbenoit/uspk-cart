### Prompt Title: Add Basic Supabase Auth and Protect Admin Route

Integrate Supabase authentication and protect the `/admin` route behind a login check.

---

### 🧱 Requirements

#### Install Supabase Client

-   Install the SDK:

    ```bash
    npm install @supabase/supabase-js
    ```

-   Create `lib/supabaseClient.js`:

    ```js
    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    export const supabase = createClient(supabaseUrl, supabaseKey);
    ```

-   Add `.env.local` values:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
    ```

#### Add Login Page

-   Create `app/login/page.js`
-   Add a form for `email` and a login button
-   Use Supabase `signInWithOtp` or `signInWithPassword`
-   On successful login, redirect to `/admin`

#### Protect Admin Route

-   In `app/admin/page.js`, check for a Supabase user session
-   If the user is not logged in, redirect to `/login`

---

### ✅ Success Criteria

-   Visiting `/login` allows user login
-   Visiting `/admin` without login redirects to `/login`
-   Logged-in users can view the admin dashboard
