"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
	createBigCommerceCart,
	getBigCommerceCart,
	addBigCommerceCartLineItems,
	updateBigCommerceCartItem,
	deleteBigCommerceCartItem,
	deleteBigCommerceCart,
	// getBigCommerceCheckoutUrl, // REMOVED - No longer called directly from context
} from "../lib/cart"; // Assuming cart.js is in lib

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
	const [cart, setCart] = useState(null); // Stores the full BigCommerce cart object
	const [cartId, setCartId] = useState(null);
	const [loading, setLoading] = useState(true); // Set to true initially
	const [error, setError] = useState(null);
	const [isMutating, setIsMutating] = useState(false); // Added for pending state
	const [cartExpired, setCartExpired] = useState(false); // ADDED: State for expired cart

	// Effect to initialize or load cart from BigCommerce
	useEffect(() => {
		const initializeCart = async () => {
			setLoading(true);
			setError(null);
			setCartExpired(false); // Reset expired state
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
						console.warn("Could not retrieve cart with stored ID. Cart may be expired or invalid.");
						localStorage.removeItem("bigCommerceCartId");
						setCartId(null); // Clear cartId state
						setCart(null); // Clear cart state
						setCartExpired(true); // Set expired state
						// setError("Your cart session has expired. Please start a new one."); // Optionally set a generic error
					}
				} catch (err) {
					console.error("Error rehydrating cart from localStorage:", err);
					setError(err.message || "Failed to load cart.");
					localStorage.removeItem("bigCommerceCartId"); // Clear invalid ID
					setCartId(null);
					setCart(null);
					// Consider if this specific error should also set cartExpired
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
			return;
		}
		setLoading(true);
		setError(null);
		setCartExpired(false); // Reset expired state
		try {
			const refreshedCart = await getBigCommerceCart(idOfCartToRefresh);
			if (refreshedCart && refreshedCart.id) {
				setCart(refreshedCart);
				setCartId(refreshedCart.id);
				localStorage.setItem("bigCommerceCartId", refreshedCart.id);
				console.log("Cart refreshed:", refreshedCart);
			} else {
				console.warn("Cart refresh returned no data for ID:", idOfCartToRefresh, ". Clearing local cart state and marking as expired.");
				setCart(null);
				setCartId(null);
				localStorage.removeItem("bigCommerceCartId");
				setCartExpired(true); // Set expired state
				// setError("Your cart session has expired. Please refresh or start a new one.");
			}
		} catch (err) {
			console.error("Error refreshing cart:", err);
			setError(err.message || "Failed to refresh cart.");
			// Potentially clear cart if refresh fails due to cart not found (e.g. 404)
			// The getBigCommerceCart function now returns null for 404/403, so the 'else' block above should handle it.
			// However, if another type of error occurs, we might want to clear the cart.
			// For now, we rely on the getBigCommerceCart's null return for expired/invalid cases.
		} finally {
			setLoading(false);
		}
	};

	const addToCart = async (productId, quantity = 1, variantId = null) => {
		if (isMutating) {
			console.log("Mutation already in progress, skipping addToCart");
			return;
		}
		setIsMutating(true);
		setLoading(true);
		setError(null);
		setCartExpired(false); // Reset expired state on new add attempt

		let currentLocalCartId = cartId || localStorage.getItem("bigCommerceCartId");

		// If cart was marked as expired, treat as if no cartId exists to force creation of a new one.
		if (cartExpired && currentLocalCartId) {
			console.log("Cart was marked as expired, attempting to create a new cart.");
			currentLocalCartId = null; // Force new cart creation in the API
			localStorage.removeItem("bigCommerceCartId"); // Clear stale ID
			setCartId(null); // Clear stale ID in state
			setCart(null); // Clear stale cart data in state
		}


		const payload = { productId, quantity, ...(variantId && { variantId }) };
		if (currentLocalCartId) {
			payload.cartId = currentLocalCartId;
		}

		try {
			console.log("Calling /api/cart/add with payload:", payload);
			const response = await fetch('/api/cart/add', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			const responseData = await response.json(); // Changed variable name to avoid conflict

			if (!response.ok) {
				console.error("Error response from /api/cart/add:", responseData);
				// Check if the error indicates an invalid cart that the API couldn't recover from
				if (responseData.error === "CART_NOT_FOUND" || response.status === 404 || response.status === 403) {
					console.warn("/api/cart/add indicated cart not found or invalid. Clearing local cart and trying to create a new one.");
					localStorage.removeItem("bigCommerceCartId");
					setCartId(null);
					setCart(null);
					setCartExpired(true); // Mark as expired so UI can react
					// Optionally, could retry addToCart without cartId here, but API route should handle new cart creation.
					// For now, let the user see the expired message and try adding again, which will then create a new cart.
					setError("Your cart session has expired. Adding the item will create a new cart.");
				} else {
					setError(responseData.message || `Failed to add item: ${response.statusText}`);
				}
				// throw new Error(responseData.message || `Failed to add item: ${response.statusText}`);
			} else if (responseData && responseData.id) {
				setCart(responseData);
				setCartId(responseData.id);
				localStorage.setItem("bigCommerceCartId", responseData.id);
				console.log("Item added, cart updated via API:", responseData);
				setCartExpired(false); // Cart is now valid
			} else {
				console.error("Received unexpected cart data from API:", responseData);
				setError("Failed to process cart update from API.");
				// throw new Error("Failed to process cart update from API.");
			}
		} catch (err) {
			console.error("Error in addToCart (calling /api/cart/add):", err);
			setError(err.message || "Failed to add item.");
		} finally {
			setLoading(false);
			setIsMutating(false);
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

		if (isMutating) {
			console.log("Mutation already in progress, skipping removeFromCart");
			return;
		}
		setIsMutating(true);
		setLoading(true);
		setError(null);
		// setCartExpired(false); // Don't reset cartExpired here

		try {
			console.log(`Calling /api/cart/remove for cart: ${currentLocalCartId}, item: ${itemId}`);
			const response = await fetch('/api/cart/remove', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ cartId: currentLocalCartId, itemId }),
			});

			const updatedCart = await response.json(); // This might be null if cart is deleted

			if (!response.ok) {
				console.error("Error response from /api/cart/remove:", updatedCart);
				// Check if the error indicates an invalid cart
				if (updatedCart.error === "CART_NOT_FOUND" || response.status === 404 || response.status === 403) {
					console.warn("/api/cart/remove indicated cart not found or invalid. Clearing local cart.");
					localStorage.removeItem("bigCommerceCartId");
					setCartId(null);
					setCart(null);
					setCartExpired(true);
					setError("Your cart session has expired. Please try adding items again.");
				} else {
					setError(updatedCart.message || `Failed to remove item: ${response.statusText}`);
				}
				// throw new Error(updatedCart.message || `Failed to remove item: ${response.statusText}`);
			} else if (updatedCart && updatedCart.id) {
				setCart(updatedCart);
				setCartId(updatedCart.id);
				localStorage.setItem("bigCommerceCartId", updatedCart.id);
				console.log("Item removed, cart updated via API:", updatedCart);
				setCartExpired(false); // Cart is valid
			} else {
				// If the cart was deleted (e.g. last item removed), or API returned null
				setCart(null);
				setCartId(null);
				localStorage.removeItem("bigCommerceCartId");
				console.log("Item removed, cart is now empty or deleted, updated via API.");
			}
		} catch (err) {
			console.error("Error in removeFromCart (calling /api/cart/remove):", err);
			setError(err.message || "Failed to remove item.");
		} finally {
			setLoading(false);
			setIsMutating(false);
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

		if (typeof quantity !== 'number' || quantity < 0) {
			console.warn("updateQuantity called with invalid quantity:", quantity);
			setError("Invalid quantity provided.");
			return;
		}

		if (quantity === 0) {
			return removeFromCart(itemId); // Delegate to removeFromCart if quantity is 0
		}

		// Find the item in the cart to get product_id and variant_id
		let itemToUpdate;
		if (cart && cart.line_items && cart.line_items.physical_items) {
			itemToUpdate = cart.line_items.physical_items.find(item => item.id === itemId);
		}

		if (!itemToUpdate) {
			console.error(`Item with ID ${itemId} not found in cart to update.`);
			setError(`Item with ID ${itemId} not found in cart.`);
			return;
		}

		const { product_id: productId, variant_id: variantId } = itemToUpdate;

		if (isMutating) {
			console.log("Mutation already in progress, skipping updateQuantity");
			return;
		}
		setIsMutating(true);
		setLoading(true);
		setError(null);

		try {
			console.log(`Calling /api/cart/update for cart: ${currentLocalCartId}, item: ${itemId}, quantity: ${quantity}, productId: ${productId}, variantId: ${variantId}`);
			const response = await fetch('/api/cart/update', {
				method: 'POST', // Using POST as per our API route convention, though PUT might be more RESTful for an update
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ cartId: currentLocalCartId, itemId, quantity, productId, variantId }),
			});

			const updatedCart = await response.json();

			if (!response.ok) {
				console.error("Error response from /api/cart/update:", updatedCart);
				// Check if the error indicates an invalid cart
				if (updatedCart.error === "CART_NOT_FOUND" || response.status === 404 || response.status === 403) {
					console.warn("/api/cart/update indicated cart not found or invalid. Clearing local cart.");
					localStorage.removeItem("bigCommerceCartId");
					setCartId(null);
					setCart(null);
					setCartExpired(true);
					setError("Your cart session has expired. Please try adding items again.");
				} else {
					setError(updatedCart.message || `Failed to update quantity: ${response.statusText}`);
				}
				// throw new Error(updatedCart.message || `Failed to update quantity: ${response.statusText}`);
			} else if (updatedCart && updatedCart.id) {
				setCart(updatedCart);
				setCartId(updatedCart.id);
				localStorage.setItem("bigCommerceCartId", updatedCart.id);
				console.log("Quantity updated, cart updated via API:", updatedCart);
				setCartExpired(false); // Cart is valid
			} else {
				console.error("Received unexpected cart data from /api/cart/update:", updatedCart);
				setError("Failed to process cart update from API after quantity change.");
				// throw new Error("Failed to process cart update from API.");
			}
		} catch (err) {
			console.error("Error in updateQuantity (calling /api/cart/update):", err);
			setError(err.message || "Failed to update quantity.");
		} finally {
			setLoading(false);
			setIsMutating(false);
		}
	};

	const clearCart = async () => {
		const currentLocalCartId = cartId || localStorage.getItem("bigCommerceCartId");
		if (!currentLocalCartId) {
			console.log("No cart to clear.");
			setCart(null);
			setCartId(null);
			// No need to remove from localStorage if it wasn't there or already cleared
			return;
		}

		if (isMutating) {
			console.log("Mutation already in progress, skipping clearCart");
			return;
		}
		setIsMutating(true);
		setLoading(true);
		setError(null);
		// setCartExpired(false); // Don't reset cartExpired here

		try {
			console.log(`Attempting to delete cart ${currentLocalCartId} from BigCommerce`);
			await deleteBigCommerceCart(currentLocalCartId); // Assumes this function exists and works
			console.log(`Cart ${currentLocalCartId} deleted from BigCommerce.`);
		} catch (err) {
			console.error(`Error deleting BigCommerce cart ${currentLocalCartId}:`, err);
			// If cart not found, it's already gone, which is fine.
			if (err.response && (err.response.status === 404 || err.response.status === 403)) {
				console.warn(`Cart ${currentLocalCartId} not found or forbidden during delete. Assuming already gone.`);
			} else {
				setError(err.message || "Failed to clear cart on server.");
				// Don't stop local clear if server clear fails for other reasons
			}
		} finally {
			// Always clear local cart state
			setCart(null);
			setCartId(null);
			localStorage.removeItem("bigCommerceCartId");
			setCartExpired(false); // A cleared cart is not an expired cart.
			setLoading(false);
			setIsMutating(false);
			console.log("Local cart cleared.");
		}
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

	// Function to get checkout URL
	const getCheckoutUrl = async () => {
		const currentLocalCartId = cartId || localStorage.getItem("bigCommerceCartId");
		if (!currentLocalCartId) {
			setError("Cart ID is missing, cannot proceed to checkout.");
			return null;
		}

		if (cartExpired) {
			setError("Cart has expired, please create a new one.");
			return null;
		}

		setIsMutating(true);
		setError(null);
		try {
			const response = await fetch('/api/cart/checkout', { // Call the new API route
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ cartId: currentLocalCartId }),
			});

			const responseData = await response.json();

			if (!response.ok) {
				console.error("Error response from /api/cart/checkout:", responseData);
				setError(responseData.message || `Failed to retrieve checkout URL: ${response.statusText}`);
				// Optionally, handle specific statuses like 404 to set cartExpired
				if (response.status === 404 && responseData.message && responseData.message.toLowerCase().includes("cart may be empty, invalid, or expired")) {
					// Consider if cart should be marked as expired based on this specific error
					// setCartExpired(true);
				}
				return null;
			}

			if (responseData.checkoutUrl) {
				return responseData.checkoutUrl;
			} else {
				console.error("Checkout URL missing in successful response from /api/cart/checkout:", responseData);
				setError("Received an unexpected response from the server when fetching checkout URL.");
				return null;
			}

		} catch (err) {
			console.error("Error calling /api/cart/checkout or processing response:", err);
			setError(err.message || "An unexpected error occurred while trying to get the checkout URL.");
			return null;
		} finally {
			setIsMutating(false);
		}
	};

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
				isMutating,
				cartExpired,
				getCheckoutUrl, // This now calls the API route
				refreshCart: () => internalRefreshCart(cartId || localStorage.getItem("bigCommerceCartId")),
				resetCartError: () => {
					setError(null);
					setCartExpired(false);
				}
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
