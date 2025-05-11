### Prompt Title: Prepare for BigCommerce Integration

Set up the foundational structure required to integrate BigCommerce as a headless commerce backend.

---

### 🧱 Requirements

#### Environment and API Setup

-   Create `.env.local.example` entries for:

    ```env
    BIGCOMMERCE_API_URL=https://api.bigcommerce.com/stores/your-store-id/v3
    BIGCOMMERCE_API_TOKEN=your-token
    BIGCOMMERCE_STORE_HASH=your-store-hash
    ```

-   Install dependencies for API communication:
    ```bash
    npm install axios
    ```

#### BigCommerce Client

-   Create `lib/bigcommerceClient.js`
-   In that file, export a configured axios instance:

    ```js
    import axios from 'axios';

    const client = axios.create({
        baseURL: process.env.BIGCOMMERCE_API_URL,
        headers: {
            'X-Auth-Token': process.env.BIGCOMMERCE_API_TOKEN,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    export default client;
    ```

---

### ✅ Success Criteria

-   Environment variables are defined
-   `lib/bigcommerceClient.js` exists and is ready to use
-   The app builds successfully and runs with placeholder values in `.env.local`
