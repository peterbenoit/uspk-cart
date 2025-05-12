"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
	createBigCommerceCart,
	getBigCommerceCart,
	addBigCommerceCartLineItems,
	updateBigCommerceCartItem,
	deleteBigCommerceCartItem,
	deleteBigCommerceCart,
} from "../lib/cart"; // Assuming cart.js is in lib

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
	const [cart, setCart] = useState(null); // Stores the full BigCommerce cart object
	const [cartId, setCartId] = useState(null);
	const [loading, setLoading] = useState(true); // Set to true initially
	const [error, setError] = useState(null);

	// Effect to initialize or load cart from BigCommerce
	useEffect(() => {
		const initializeCart = async () => {
			setLoading(true);
			setError(null);
			let storedCartId = localStorage.getItem("bigCommerceCartId");

			if (storedCartId) {
				try {
					console.log("Found stored cartId:", storedCartId);
					const existingCart = await getBigCommerceCart(storedCartId);
					if (existingCart && existingCart.id) { // Check if cart is valid
						setCart(existingCart);
						setCartId(existingCart.id);
						console.log("Cart rehydrated from localStorage:", existingCart);
					} else {
						// Cart ID from local storage might be invalid or cart deleted on server
						console.warn("Could not retrieve cart with stored ID, creating new one if needed or clearing ID.");
						localStorage.removeItem("bigCommerceCartId");
						storedCartId = null; // Ensure we don't try to use it again in this session unless a new cart is made
						// Optionally, create a new cart here if that's desired behavior,
						// or wait for an item to be added. For now, just clear the invalid ID.
						// setCart(null); // Already null
						// setCartId(null); // Already null
					}
				} catch (err) {
					console.error("Error rehydrating cart from localStorage:", err);
					setError(err.message || "Failed to load cart.");
					localStorage.removeItem("bigCommerceCartId"); // Clear invalid ID
					storedCartId = null;
					// setCart(null); // Already null
					// setCartId(null); // Already null
				}
			} else {
				console.log("No cartId in localStorage.");
				// Don't create a new cart automatically here.
				// Cart creation will be triggered by addToCart if no cartId exists.
			}
			setLoading(false);
		};
		initializeCart();
	}, []);

	// Function to refresh cart data from BigCommerce
	const internalRefreshCart = async (idOfCartToRefresh) => {
		if (!idOfCartToRefresh) {
			// console.warn("internalRefreshCart called with no cartId. Cart might be empty or not yet created.");
			// setCart(null); // Keep current cart state if no ID to refresh
			// setLoading(false); // Ensure loading is false if we can't refresh
			return; // Do nothing if there's no cart ID
		}
		setLoading(true);
		setError(null);
		try {
			const refreshedCart = await getBigCommerceCart(idOfCartToRefresh);
			if (refreshedCart && refreshedCart.id) {
				setCart(refreshedCart);
				setCartId(refreshedCart.id); // Ensure cartId state is also updated
				localStorage.setItem("bigCommerceCartId", refreshedCart.id); // Persist refreshed cart_id
				console.log("Cart refreshed:", refreshedCart);
			} else {
				// If refresh returns null or no id, the cart might have been deleted on server
				console.warn("Cart refresh returned no data for ID:", idOfCartToRefresh, ". Clearing local cart state.");
				setCart(null);
				setCartId(null);
				localStorage.removeItem("bigCommerceCartId");
			}
		} catch (err) {
			console.error("Error refreshing cart:", err);
			setError(err.message || "Failed to refresh cart.");
			// Potentially clear cart if refresh fails due to cart not found (e.g. 404)
			if (err.response && err.response.status === 404) {
				console.warn("Cart not found on server during refresh. Clearing local cart state.");
				setCart(null);
				setCartId(null);
				localStorage.removeItem("bigCommerceCartId");
			}
		} finally {
			setLoading(false);
		}
	};

	const addToCart = async (productId, quantity = 1, variantId = null) => {
		setLoading(true);
		setError(null);
		const lineItems = [{ productId, quantity, ...(variantId && { variant_id: variantId }) }];
		let currentLocalCartId = cartId || localStorage.getItem("bigCommerceCartId");

		try {
			let updatedCart;
			if (currentLocalCartId) {
				console.log("Adding to existing cart:", currentLocalCartId);
				updatedCart = await addBigCommerceCartLineItems(currentLocalCartId, lineItems);
			} else {
				console.log("Creating new cart");
				updatedCart = await createBigCommerceCart(lineItems);
			}

			if (updatedCart && updatedCart.id) {
				setCart(updatedCart);
				setCartId(updatedCart.id);
				localStorage.setItem("bigCommerceCartId", updatedCart.id);
				console.log("Item added, cart updated:", updatedCart);
			} else {
				throw new Error("Failed to add item to cart or create cart.");
			}
		} catch (err) {
			console.error("Error in addToCart:", err);
			setError(err.message || "Failed to add item.");
			// If cart creation failed, ensure no stale cartId is left in localStorage
			if (!currentLocalCartId) {
				localStorage.removeItem("bigCommerceCartId");
			}
		} finally {
			setLoading(false);
		}
	};

	// itemId is the BigCommerce line_item_id
	const removeFromCart = async (itemId) => {
		const currentLocalCartId = cartId || localStorage.getItem("bigCommerceCartId");
		if (!currentLocalCartId || !itemId) {
			console.warn("removeFromCart called with no cartId or itemId.");
			setError("Cart or item ID is missing.");
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const updatedCart = await deleteBigCommerceCartItem(currentLocalCartId, itemId);
			// deleteBigCommerceCartItem might return null if the cart becomes empty and is deleted.
			// Or it might return the updated cart.
			if (updatedCart && updatedCart.id) {
				setCart(updatedCart);
				setCartId(updatedCart.id); // Ensure cartId state is also updated
				localStorage.setItem("bigCommerceCartId", updatedCart.id); // Persist cart_id
			} else {
				// If the cart was deleted (e.g. last item removed), clear local state
				setCart(null);
				setCartId(null);
				localStorage.removeItem("bigCommerceCartId");
			}
			console.log("Item removed, cart updated:", updatedCart);
			// No need to call internalRefreshCart here as the response should be the latest cart state
		} catch (err) {
			console.error("Error removing item from cart:", err);
			setError(err.message || "Failed to remove item.");
		} finally {
			setLoading(false);
		}
	};

	// itemId is the BigCommerce line_item_id
	const updateQuantity = async (itemId, quantity) => {
		const currentLocalCartId = cartId || localStorage.getItem("bigCommerceCartId");
		if (!currentLocalCartId || !itemId) {
			console.warn("updateQuantity called with no cartId or itemId.");
			setError("Cart or item ID is missing.");
			return;
		}
		if (quantity <= 0) {
			return removeFromCart(itemId); // Delegate to removeFromCart if quantity is 0 or less
		}
		setLoading(true);
		setError(null);
		try {
			// The itemData for updateBigCommerceCartItem needs to be in the format: { line_item: { quantity: newQuantity, product_id: existingProductId, variant_id: existingVariantId (if any) } }
			// However, the BigCommerce API for PUT /carts/{cartId}/items/{itemId} only requires { line_item: { quantity: newQuantity } }
			// Or, more simply, just { "line_item": { "quantity": quantity } }
			// Let's find the item in the current cart to get its product_id and variant_id if needed, though the API might not require it for a simple quantity update.
			// The API docs suggest: body: { "line_item": { "quantity": 3 } } is sufficient.

			const itemData = { line_item: { quantity } };
			const updatedCart = await updateBigCommerceCartItem(currentLocalCartId, itemId, itemData);

			if (updatedCart && updatedCart.id) {
				setCart(updatedCart);
				setCartId(updatedCart.id); // Ensure cartId state is also updated
				localStorage.setItem("bigCommerceCartId", updatedCart.id); // Persist cart_id
				console.log("Quantity updated, cart refreshed:", updatedCart);
			} else {
				// This case should ideally not happen if the update was successful but returned no cart
				// or if the update failed and an error was thrown.
				console.warn("Cart update did not return a valid cart object.");
				// Attempt a manual refresh as a fallback
				await internalRefreshCart(currentLocalCartId);
			}
		} catch (err) {
			console.error("Error updating item quantity:", err);
			setError(err.message || "Failed to update quantity.");
		} finally {
			setLoading(false);
		}
	};

	const clearCart = async () => {
		setLoading(true);
		setError(null);
		const currentLocalCartId = cartId || localStorage.getItem("bigCommerceCartId");

		if (currentLocalCartId) {
			try {
				await deleteBigCommerceCart(currentLocalCartId);
				console.log("BigCommerce cart deleted:", currentLocalCartId);
			} catch (err) {
				console.error("Error deleting BigCommerce cart:", err);
				// Don't set error state here, as we will clear client-side anyway
			}
		}
		// Always clear client-side cart state and localStorage
		setCart(null);
		setCartId(null);
		localStorage.removeItem("bigCommerceCartId");
		console.log("Client-side cart cleared.");
		setLoading(false);
	};

	const getCartTotalItems = () => {
		if (!cart || !cart.line_items || !cart.line_items.physical_items) {
			return 0;
		}
		return cart.line_items.physical_items.reduce(
			(total, item) => total + item.quantity,
			0
		);
	};

	const getCartSubtotal = () => {
		if (cart && cart.cart_amount_inc_tax && typeof cart.cart_amount_inc_tax === 'number') {
			return cart.cart_amount_inc_tax; // Using inc_tax as per typical display
		}
		if (cart && cart.base_amount && typeof cart.base_amount === 'number') {
			return cart.base_amount;
		}
		return 0;
	};

	const getRawCart = () => cart;

	return (
		<CartContext.Provider
			value={{
				cart,
				cartId,
				cartItems: cart && cart.line_items && cart.line_items.physical_items ? cart.line_items.physical_items : [],
				addToCart,
				removeFromCart,
				updateQuantity,
				clearCart,
				getCartTotalItems,
				getCartSubtotal,
				getRawCart,
				loading,
				error,
				refreshCart: () => internalRefreshCart(cartId || localStorage.getItem("bigCommerceCartId"))
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
