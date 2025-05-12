import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// This route checks if a user session exists based on the presence of the session cookie.
// In a real application, you might also validate the token against BigCommerce or your session store.

export async function GET(request) {
	try {
		const sessionToken = cookies().get('bc_customer_session_token')?.value;

		if (!sessionToken) {
			return NextResponse.json({ user: null, message: 'No active session' }, { status: 200 });
		}

		// Here, you would typically validate the sessionToken.
		// For example, decode a JWT, or make a call to BigCommerce to verify its validity
		// and get customer details.
		// For this simulation, if a token exists, we'll assume it's valid and return mock user data.

		// --- SIMULATED SESSION VALIDATION & USER FETCH ---
		// In a real scenario, you'd get this from BC or your DB based on the sessionToken
		const customerId = cookies().get('bc_customer_id')?.value || 'unknown'; // Example, if you stored it
		const user = {
			// email: 'user@example.com', // You would fetch this based on the session/customer ID
			id: customerId, // Or the actual BigCommerce customer ID
			// name: 'Test User' // Other relevant user details
			// For now, we can just confirm a session exists.
			// The login response from /api/auth/login should be the source of truth for initial customerId.
			// This session endpoint primarily confirms an active session cookie.
			isLoggedIn: true,
			customerId: customerId, // This might be redundant if `id` is the customerId
		};
		// --- END SIMULATION ---

		// If token is invalid or expired after validation, return { user: null }
		// if (!isValid) {
		//   cookies().delete('bc_customer_session_token');
		//   cookies().delete('bc_customer_id');
		//   return NextResponse.json({ user: null, message: 'Session invalid or expired' }, { status: 200 });
		// }

		return NextResponse.json({ user });

	} catch (error) {
		console.error('API Session Error:', error);
		return NextResponse.json({ user: null, message: 'Error fetching session information' }, { status: 500 });
	}
}
