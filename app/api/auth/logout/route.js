import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
	try {
		// Clear the session cookie(s)
		cookies().delete('bc_customer_session_token');
		// If you stored other related cookies, delete them too:
		// cookies().delete('bc_customer_id');

		return NextResponse.json({ success: true, message: 'Logout successful' });
	} catch (error) {
		console.error('API Logout Error:', error);
		// Even if there's an error, the client will likely proceed as if logged out.
		// So, a 500 might be confusing if cookies were partially cleared or if the error is minor.
		// However, for robust error tracking, it's good to report it.
		return NextResponse.json({ message: 'An error occurred during logout.' }, { status: 500 });
	}
}
