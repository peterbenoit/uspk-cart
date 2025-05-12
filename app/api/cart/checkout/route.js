import { NextResponse } from 'next/server';
import { getBigCommerceCheckoutUrl } from '../../../../lib/cart';

export async function POST(request) {
	try {
		const { cartId } = await request.json();

		if (!cartId) {
			return NextResponse.json({ message: 'Cart ID is required' }, { status: 400 });
		}

		// This function is defined in lib/cart.js and uses the server-side BigCommerce client
		const checkoutUrl = await getBigCommerceCheckoutUrl(cartId);

		if (checkoutUrl) {
			return NextResponse.json({ checkoutUrl });
		} else {
			// getBigCommerceCheckoutUrl logs details and returns null on specific errors like 404
			return NextResponse.json({ message: 'Could not retrieve checkout URL. The cart may be empty, invalid, or expired, or an internal error occurred.' }, { status: 404 }); // Using 404 as per typical behavior of the BC endpoint for missing/empty carts
		}
	} catch (error) {
		console.error('API error in /api/cart/checkout:', error);
		const errorMessage = error.message || 'An unexpected error occurred while fetching the checkout URL.';
		// Avoid sending detailed internal error structures to the client if possible
		// error.response?.data might contain sensitive info or be too verbose
		return NextResponse.json({ message: errorMessage }, { status: 500 });
	}
}
