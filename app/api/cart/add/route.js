import { NextResponse } from 'next/server';
import { createBigCommerceCart, addBigCommerceCartLineItems, getBigCommerceCart } from '../../../../lib/cart';

export async function POST(request) {
	console.log("/api/cart/add POST request received"); // Log request entry
	try {
		const body = await request.json();
		const { productId, quantity = 1, variantId, cartId: existingCartId } = body;

		console.log("/api/cart/add payload:", body); // Log payload

		if (!productId) {
			console.log("/api/cart/add: Invalid productId or quantity");
			return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
		}

		const lineItems = [{ productId, quantity, ...(variantId && { variant_id: variantId }) }];
		let cart;
		let newCartCreated = false;

		if (existingCartId) {
			console.log(`/api/cart/add: Attempting to fetch existing cart: ${existingCartId}`);
			try {
				const currentCart = await getBigCommerceCart(existingCartId);
				if (currentCart && currentCart.id) {
					console.log(`/api/cart/add: Existing cart ${existingCartId} found. Adding items.`);
					cart = await addBigCommerceCartLineItems(existingCartId, lineItems);
				} else {
					console.log(`/api/cart/add: Cart ${existingCartId} not found on BigCommerce. Creating a new cart.`);
					cart = await createBigCommerceCart(lineItems);
					newCartCreated = true;
					console.log("/api/cart/add: New cart created:", cart.id);
				}
			} catch (fetchError) {
				console.error(`/api/cart/add: Error fetching cart ${existingCartId}: `, fetchError.response?.data || fetchError.message);
				if (fetchError.response?.status !== 404) {
					throw fetchError;
				}
			}
		} else {
			console.log('No existing cart ID provided. Creating a new cart.');
			cart = await createBigCommerceCart(lineItems);
			newCartCreated = true;
			console.log("/api/cart/add: New cart created:", cart.id);
		}

		if (!cart || !cart.id) {
			console.error('Failed to create or update cart with BigCommerce');
			return NextResponse.json({ message: 'Failed to update cart with BigCommerce' }, { status: 500 });
		}

		console.log("/api/cart/add: Successfully processed cart:", cart.id);
		return NextResponse.json(cart, { status: 200 });

	} catch (error) {
		console.error('/api/cart/add: Unhandled error in POST handler:', error);
		const errorMessage = error.response?.data?.title || error.message || 'An unexpected error occurred';
		const errorStatus = error.response?.status || 500;
		return NextResponse.json({ message: 'Failed to add item to cart.', error: errorMessage }, { status: errorStatus });
	}
}
