import client from "./bigcommerceClient";

// Helper function to format line items for BigCommerce
const formatLineItems = (items) => {
	return items.map((item) => ({
		product_id: item.productId,
		quantity: item.quantity,
		...(item.variant_id && { variant_id: item.variant_id }) // Add variant_id if present
	}));
};

/**
 * Creates a new cart in BigCommerce.
 * @param {Array} lineItems - Array of items to add to the new cart.
 *                            Each item: { productId: Number, quantity: Number }
 * @returns {Promise<Object>} The created cart object from BigCommerce.
 */
export const createBigCommerceCart = async (lineItems) => {
	try {
		const response = await client.post("/carts", { // Changed from /v3/carts
			line_items: formatLineItems(lineItems),
			// channel_id: 1, // Optional: If you have multiple sales channels
		});
		return response.data.data; // The cart object is nested in response.data.data
	} catch (error) {
		console.error("Error creating BigCommerce cart:", error.response?.data || error.message);
		throw error;
	}
};

/**
 * Retrieves a cart from BigCommerce.
 * @param {string} cartId - The ID of the cart to retrieve.
 * @returns {Promise<Object>} The cart object from BigCommerce.
 */
export const getBigCommerceCart = async (cartId) => {
	if (!cartId) {
		console.warn("getBigCommerceCart called with no cartId");
		return null;
	}
	try {
		const response = await client.get(`/carts/${cartId}?include=line_items.physical_items.options,promotions.banners`); // Changed from /v3/carts
		return response.data.data;
	} catch (error) {
		console.error(`Error fetching BigCommerce cart ${cartId}:`, error.response?.data || error.message);
		if (error.response && error.response.status === 404) {
			return null; // Cart not found, likely expired or invalid
		}
		throw error;
	}
};

/**
 * Adds line items to an existing BigCommerce cart.
 * @param {string} cartId - The ID of the cart.
 * @param {Array} lineItems - Array of items to add.
 *                           Each item: { productId: Number, quantity: Number }
 * @returns {Promise<Object>} The updated cart object from BigCommerce.
 */
export const addBigCommerceCartLineItems = async (cartId, lineItems) => {
	if (!cartId) {
		console.error("addBigCommerceCartLineItems called with no cartId.");
		throw new Error("Cannot add items to cart without a cart ID.");
	}
	try {
		const response = await client.post(`/carts/${cartId}/items`, { // Changed from /v3/carts
			line_items: formatLineItems(lineItems),
		});
		return response.data.data;
	} catch (error) {
		console.error(`Error adding items to BigCommerce cart ${cartId}:`, error.response?.data || error.message);
		throw error;
	}
};

/**
 * Updates a specific item's quantity in a BigCommerce cart.
 * @param {string} cartId - The ID of the cart.
 * @param {string} itemId - The ID of the line item to update.
 * @param {Object} itemData - The new data for the item.
 * @returns {Promise<Object>} The updated cart object from BigCommerce.
 */
export const updateBigCommerceCartItem = async (cartId, itemId, itemData) => { // Changed 'quantity' to 'itemData'
	if (!cartId || !itemId) {
		console.warn("updateBigCommerceCartItem called with no cartId or itemId");
		return null;
	}
	try {
		// itemData should be the body of the request, e.g., { line_item: { quantity: newQuantity } }
		const response = await client.put(`/carts/${cartId}/items/${itemId}`, itemData); // Changed from /v3/carts
		return response.data.data;
	} catch (error) {
		console.error(`Error updating BigCommerce cart item ${itemId}:`, error.response?.data || error.message);
		throw error;
	}
};

/**
 * Removes a specific item from a BigCommerce cart.
 * @param {string} cartId - The ID of the cart.
 * @param {string} itemId - The ID of the line item to remove.
 * @returns {Promise<Object|null>} The updated cart object or null if the cart becomes empty.
 */
export const deleteBigCommerceCartItem = async (cartId, itemId) => {
	if (!cartId || !itemId) {
		console.error("deleteBigCommerceCartItem called with no cartId or itemId.");
		throw new Error("Cannot delete item without cart ID and item ID.");
	}
	try {
		// Adding `include=line_items` to get the updated cart in the response.
		// If the cart is empty after deletion, BigCommerce might return a 204 with no body.
		const response = await client.delete(`/carts/${cartId}/items/${itemId}?include=line_items`);
		if (response.status === 204) { // Cart is now empty
			return null;
		}
		return response.data.data;
	} catch (error) {
		console.error(`Error deleting item ${itemId} from BigCommerce cart ${cartId}:`, error.response?.data || error.message);
		throw error;
	}
};

/**
 * Deletes an entire cart from BigCommerce.
 * @param {string} cartId - The ID of the cart to delete.
 * @returns {Promise<void>}
 */
export const deleteBigCommerceCart = async (cartId) => {
	if (!cartId) {
		console.warn("deleteBigCommerceCart called with no cartId");
		return;
	}
	try {
		await client.delete(`/carts/${cartId}`); // Changed from /v3/carts
	} catch (error) {
		console.error(`Error deleting BigCommerce cart ${cartId}:`, error.response?.data || error.message);
		// Do not throw if cart not found, it's already gone.
		if (error.response && error.response.status === 404) {
			return;
		}
		throw error;
	}
};
