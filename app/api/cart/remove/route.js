import { NextResponse } from "next/server";
import { deleteBigCommerceCartItem, getBigCommerceCart } from "@/lib/cart";

export async function POST(request) {
	console.log("/api/cart/remove POST request received");
	try {
		const body = await request.json();
		const { cartId, itemId } = body;

		console.log("/api/cart/remove payload:", body);

		if (!cartId || !itemId) {
			console.log("/api/cart/remove: Missing cartId or itemId");
			return NextResponse.json(
				{ message: "Missing cartId or itemId." },
				{ status: 400 }
			);
		}

		// The deleteBigCommerceCartItem function in lib/cart.js already handles
		// refetching the cart if the delete operation returns a 204 No Content.
		const updatedCart = await deleteBigCommerceCartItem(cartId, itemId);

		if (updatedCart) {
			console.log(
				`/api/cart/remove: Item ${itemId} removed from cart ${cartId}. Returning updated cart.`,
				updatedCart.id
			);
			return NextResponse.json(updatedCart);
		} else {
			// This case could happen if the cart becomes empty and is deleted,
			// or if deleteBigCommerceCartItem explicitly returns null.
			console.log(
				`/api/cart/remove: Cart ${cartId} may be empty or deleted after item removal.`
			);
			return NextResponse.json(null); // Or an empty cart representation: { id: cartId, line_items: [] }
		}
	} catch (error) {
		console.error(
			`/api/cart/remove: Error removing item:`,
			error.response?.data || error.message
		);
		return NextResponse.json(
			{
				message: "Failed to remove item from cart.",
				error: error.response?.data || error.message,
			},
			{ status: 500 }
		);
	}
}
