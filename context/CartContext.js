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
	const [isMutating, setIsMutating] = useState(false); // Added for pending state

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
		if (isMutating) {
			console.log("Mutation already in progress, skipping addToCart");
			return;
		}
		setIsMutating(true);
		setLoading(true); // Keep for general loading state if preferred
		setError(null);

		const currentLocalCartId = cartId || localStorage.getItem("bigCommerceCartId");
		const payload = { productId, quantity, ...(variantId && { variantId }) };
		if (currentLocalCartId) {
			payload.cartId = currentLocalCartId; // Send existing cartId to the API route
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

			const updatedCart = await response.json();

			if (!response.ok) {
				console.error("Error response from /api/cart/add:", updatedCart);
				throw new Error(updatedCart.message || `Failed to add item: ${response.statusText}`);
			}

			if (updatedCart && updatedCart.id) {
				setCart(updatedCart);
				setCartId(updatedCart.id);
				localStorage.setItem("bigCommerceCartId", updatedCart.id);
				console.log("Item added, cart updated via API:", updatedCart);
				// Potentially show a success toast/message here
			} else {
				console.error("Received unexpected cart data from API:", updatedCart);
				throw new Error("Failed to process cart update from API.");
			}
		} catch (err) {
			console.error("Error in addToCart (calling /api/cart/add):", err);
			setError(err.message || "Failed to add item.");
			// No need to clear local storage cartId here, as the API route handles cart creation/retrieval logic
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
				throw new Error(updatedCart.message || `Failed to remove item: ${response.statusText}`);
			}

			if (updatedCart && updatedCart.id) {
				setCart(updatedCart);
				setCartId(updatedCart.id);
				localStorage.setItem("bigCommerceCartId", updatedCart.id);
				console.log("Item removed, cart updated via API:", updatedCart);
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
				throw new Error(updatedCart.message || `Failed to update quantity: ${response.statusText}`);
			}

			if (updatedCart && updatedCart.id) {
				setCart(updatedCart);
				setCartId(updatedCart.id);
				localStorage.setItem("bigCommerceCartId", updatedCart.id);
				console.log("Quantity updated, cart updated via API:", updatedCart);
			} else {
				console.error("Received unexpected cart data from /api/cart/update:", updatedCart);
				throw new Error("Failed to process cart update from API after quantity change.");
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
				isMutating, // Expose isMutating
				refreshCart: () => internalRefreshCart(cartId || localStorage.getItem("bigCommerceCartId"))
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
