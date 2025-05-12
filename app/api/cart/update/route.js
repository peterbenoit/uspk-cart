import { NextResponse } from "next/server";
import { updateBigCommerceCartItem } from "@/lib/cart";

export async function POST(request) {
	console.log("/api/cart/update POST request received");
	try {
		const body = await request.json();
		const { cartId, itemId, quantity, productId, variantId } = body; // Added productId and variantId

		console.log("/api/cart/update payload:", body);

		if (!cartId || !itemId || typeof quantity !== 'number' || quantity < 0 || !productId) { // Added productId check
			console.log("/api/cart/update: Missing or invalid parameters");
			return NextResponse.json(
				{ message: "Missing or invalid cartId, itemId, quantity, or productId." }, // Updated message
				{ status: 400 }
			);
		}

		// The BigCommerce API for PUT /carts/{cartId}/items/{itemId}
		// expects a body like: { line_item: { quantity: newQuantity, product_id: existingProductId, variant_id: existingVariantId (if applicable) } }
		const lineItemData = { quantity, product_id: productId };
		if (variantId) { // Conditionally add variant_id if it exists
			lineItemData.variant_id = variantId;
		}
		const itemData = { line_item: lineItemData };

		const updatedCart = await updateBigCommerceCartItem(cartId, itemId, itemData);

		if (updatedCart) {
			console.log(
				`/api/cart/update: Item ${itemId} in cart ${cartId} updated to quantity ${quantity}. Returning updated cart.`,
				updatedCart.id
			);
			return NextResponse.json(updatedCart);
		} else {
			// This case might indicate an issue with the update or if the cart somehow became invalid
			console.log(
				`/api/cart/update: Update for item ${itemId} in cart ${cartId} did not return an updated cart.`
			);
			// It's possible an error should have been thrown by updateBigCommerceCartItem if it failed.
			// If it returns null without error, it's an ambiguous state.
			return NextResponse.json(
				{ message: "Failed to update item quantity, or cart became invalid." },
				{ status: 500 } // Or a more specific error if known
			);
		}
	} catch (error) {
		console.error(
			`/api/cart/update: Error updating item quantity:`,
			error.response?.data || error.message
		);
		return NextResponse.json(
			{
				message: "Failed to update item quantity.",
				error: error.response?.data || error.message,
			},
			{ status: 500 }
		);
	}
}
