### Prompt Title: Create Contact Page with Basic Form and Resend Hookup

Create a functional contact page using a simple HTML form. When submitted, the data should be sent to a route handler that uses Resend to email the form content.

---

### 🧱 Requirements

#### Contact Form UI

- Create `app/contact/page.js` as a **client component** by starting with `"use client";`
- Use the `useSearchParams()` hook from `next/navigation` to check if `success=true` is in the query string
- Add a form with the following fields:
    - `name` (text input)
    - `email` (email input)
    - `message` (textarea)
- Use a `<form method="POST">` and basic Tailwind classes
- Add a submit button
- If `success === 'true'`, display a confirmation message at the top of the page

#### API Route

- Create `app/api/contact/route.js`
- Use the POST method to receive and parse the form data
- Use the Resend SDK to send an email with the form contents
- Store your Resend API key in `.env.local`:
    ```env
    RESEND_API_KEY=your-key-here
    ```

#### Resend Client

- Create `lib/resendClient.js`
- Initialize the Resend instance using the API key from environment variables

---

### ✅ Success Criteria

- Visiting `/contact` renders the form
- Submitting the form triggers the route and sends an email
- No hydration or runtime errors
- Client-side JavaScript is used only for reading `searchParams`

_Note: Do not implement rate limiting, validation, or database storage yet._
