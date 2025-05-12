import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // To manage cookies

// This would ideally be a more sophisticated BigCommerce API client
// that can handle customer login. For now, we'll simulate the process.
// You would typically use a library or a custom setup for BigCommerce's
// Customer Login API or a similar OAuth/token-based flow.

// Placeholder for BigCommerce Customer Login API endpoint
// const BIGCOMMERCE_CUSTOMER_LOGIN_API_URL = `${process.env.BIGCOMMERCE_API_URL}/v3/customers/login`; // This is an example, actual endpoint might differ

export async function POST(request) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
		}

		// In a real scenario, you would make a request to BigCommerce's
		// Customer Login API (or your custom authentication backend that proxies to it).
		// This API would validate the credentials and return a session token or customer data.

		// --- SIMULATED BIGCOMMERCE API CALL ---
		// Replace this with actual API call to BigCommerce
		// For example:
		// const bcApiResponse = await fetch(BIGCOMMERCE_CUSTOMER_LOGIN_API_URL, {
		//   method: 'POST',
		//   headers: {
		//     'Content-Type': 'application/json',
		//     // Potentially other headers like an API key if your proxy requires it
		//   },
		//   body: JSON.stringify({ email, password, company_name: 'YourStoreName' }) // company_name might be needed
		// });
		// const bcData = await bcApiResponse.json();
		// if (!bcApiResponse.ok || !bcData.token) { // Assuming token is returned
		//   throw new Error(bcData.message || 'BigCommerce authentication failed');
		// }
		// const sessionToken = bcData.token;
		// const customerId = bcData.customer_id; // Or other customer details

		// --- START SIMULATION ---
		let sessionToken;
		let customerId;
		if (email === 'test@example.com' && password === 'password123') {
			// Simulate successful login
			sessionToken = 'fake-bc-customer-session-token-' + Date.now();
			customerId = 123; // Simulated customer ID
			// --- END SIMULATION ---

			// Store the session token in an HTTP-only cookie for security
			cookies().set('bc_customer_session_token', sessionToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				path: '/',
				maxAge: 60 * 60 * 24 * 7, // 1 week, adjust as needed
				sameSite: 'lax',
			});

			// Optionally, store customer ID or other non-sensitive info if needed client-side
			// cookies().set('bc_customer_id', customerId.toString(), { ... });


			return NextResponse.json({ success: true, message: 'Login successful', customerId });
		} else {
			// Simulate failed login
			return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
		}

	} catch (error) {
		console.error('API Auth Login Error:', error);
		return NextResponse.json({ message: error.message || 'An unexpected error occurred during login.' }, { status: 500 });
	}
}
