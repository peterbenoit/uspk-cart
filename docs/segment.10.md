### Prompt Title: Add Logout Functionality and Show User Session

Add a logout button to the admin page and display basic session info for the logged-in user.

---

### 🧱 Requirements

#### Logout Function

-   In `app/admin/page.js`, add a “Logout” button
-   On click, call `supabase.auth.signOut()`
-   After logout, redirect the user to `/login`

#### Session Display

-   At the top of the admin page, display the user’s email address (from the Supabase session)
-   Example: `Logged in as: user@example.com`

#### Notes

-   Use Supabase's client-side auth detection to access session info
-   Use `useEffect` and `useState` to load the session on mount

---

### ✅ Success Criteria

-   Admin page shows logged-in user's email
-   Logout button signs out and redirects to login
-   After logout, user cannot access `/admin` directly
