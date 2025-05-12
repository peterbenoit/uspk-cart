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
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Effect to initialize or load cart from BigCommerce
	useEffect(() => {
		const initializeCart = async () => {
			setLoading(true);
			setError(null);
			try {
				const localCartId = localStorage.getItem("bigCommerceCartId");
				if (localCartId) {
					const fetchedCart = await getBigCommerceCart(localCartId);
					if (fetchedCart && fetchedCart.id) {
						setCart(fetchedCart);
						setCartId(fetchedCart.id);
						// Ensure localStorage is updated with the potentially renewed cart_id from BC
						localStorage.setItem("bigCommerceCartId", fetchedCart.id);
					} else {
						// Cart ID was invalid, cart expired, or not found
						localStorage.removeItem("bigCommerceCartId");
						setCartId(null);
						setCart(null);
					}
				}
			} catch (err) {
				console.error("Failed to initialize cart:", err);
				setError("Failed to load cart. Please try again.");
				localStorage.removeItem("bigCommerceCartId"); // Clear potentially invalid ID
				setCartId(null);
				setCart(null);
			} finally {
				setLoading(false);
			}
		};
		initializeCart();
	}, []);

	// Function to refresh cart data from BigCommerce
	const internalRefreshCart = async (idOfCartToRefresh) => {
		if (!idOfCartToRefresh) {
			// If there's no ID, ensure client state is cleared
			setCart(null);
			setCartId(null);
			localStorage.removeItem("bigCommerceCartId");
			return null;
		}
		setLoading(true);
		setError(null);
		try {
			const updatedCartData = await getBigCommerceCart(idOfCartToRefresh);
			if (updatedCartData && updatedCartData.id) {
				setCart(updatedCartData);
				setCartId(updatedCartData.id);
				localStorage.setItem("bigCommerceCartId", updatedCartData.id);
			} else {
				// Cart not found or invalid response
				localStorage.removeItem("bigCommerceCartId");
				setCartId(null);
				setCart(null);
			}
			return updatedCartData;
		} catch (err) {
			console.error("Error refreshing cart:", err);
			setError("Could not update cart information.");
			// If 404, cart is gone
			if (err.response && err.response.status === 404) {
				localStorage.removeItem("bigCommerceCartId");
				setCartId(null);
				setCart(null);
			}
			return null;
		} finally {
			setLoading(false);
		}
	};

	const addToCart = async (productId, quantity = 1) => {
		setLoading(true);
		setError(null);
		const lineItems = [{ productId, quantity }];
		const currentLocalCartId = cartId; // Use cartId from state

		try {
			let updatedCartData;
			if (currentLocalCartId) {
				updatedCartData = await addBigCommerceCartLineItems(currentLocalCartId, lineItems);
			} else {
				updatedCartData = await createBigCommerceCart(lineItems);
			}

			if (updatedCartData && updatedCartData.id) {
				setCart(updatedCartData);
				setCartId(updatedCartData.id);
				localStorage.setItem("bigCommerceCartId", updatedCartData.id);
			} else {
				setError("Failed to add item to cart. Cart data might be inconsistent.");
				// Attempt to recover or clear if cart operation failed
				if (currentLocalCartId) {
					await internalRefreshCart(currentLocalCartId);
				} else {
					// If create failed without returning an ID
					setCart(null);
					setCartId(null);
					localStorage.removeItem("bigCommerceCartId");
				}
			}
		} catch (err) {
			console.error("Error adding to cart:", err);
			setError("Failed to add item. Please try again.");
			// If cart ID became invalid during add (e.g. cart expired and 404'd)
			if (err.response && err.response.status === 404 && currentLocalCartId) {
				localStorage.removeItem("bigCommerceCartId");
				setCartId(null);
				setCart(null);
				// Consider if we should attempt to create a new cart here with the item:
				// return addToCart(productId, quantity); // Caution: potential loop
			}
		} finally {
			setLoading(false);
		}
	};

	// itemId is the BigCommerce line_item_id
	const removeFromCart = async (itemId) => {
		const currentLocalCartId = cartId;
		if (!currentLocalCartId || !itemId) {
			setError("Cannot remove item: Cart or Item ID missing.");
			return;
		}
		setLoading(true);
		setError(null);
		try {
			// deleteBigCommerceCartItem returns the updated cart or null if cart becomes empty and is deleted by BC
			const cartAfterItemDeletion = await deleteBigCommerceCartItem(currentLocalCartId, itemId);

			if (cartAfterItemDeletion && cartAfterItemDeletion.id) {
				// Item removed, cart still exists (might be empty but not auto-deleted)
				setCart(cartAfterItemDeletion);
				// cartId and localStorage entry remain as is.
			} else if (cartAfterItemDeletion === null) {
				// BigCommerce returned 204 (or our lib mapped it to null), cart is empty AND deleted.
				setCart(null);
				setCartId(null);
				localStorage.removeItem("bigCommerceCartId");
			} else {
				// Unexpected response from deleteBigCommerceCartItem (e.g. undefined)
				setError("Failed to remove item due to an unexpected API response.");
				await internalRefreshCart(currentLocalCartId); // Try to get a consistent state
			}
		} catch (err) {
			console.error("Error removing item from cart:", err);
			setError("Failed to remove item. Please try again.");
			if (err.response && err.response.status === 404) { // Cart was already gone
				localStorage.removeItem("bigCommerceCartId");
				setCartId(null);
				setCart(null);
			}
		} finally {
			setLoading(false);
		}
	};

	// itemId is the BigCommerce line_item_id
	const updateQuantity = async (itemId, quantity) => {
		const currentLocalCartId = cartId;
		if (!currentLocalCartId || !itemId) {
			setError("Cannot update quantity: Cart or Item ID missing.");
			return;
		}
		if (quantity <= 0) {
			return removeFromCart(itemId); // Delegate to removeFromCart for 0 or less quantity
		}
		setLoading(true);
		setError(null);
		try {
			const updatedCartData = await updateBigCommerceCartItem(currentLocalCartId, itemId, quantity);
			if (updatedCartData && updatedCartData.id) {
				setCart(updatedCartData);
				// cartId and localStorage remain as is.
			} else {
				setError("Failed to update item quantity. Cart data might be inconsistent.");
				await internalRefreshCart(currentLocalCartId); // Attempt to recover state
			}
		} catch (err) {
			console.error("Error updating quantity:", err);
			setError("Failed to update quantity. Please try again.");
			if (err.response && err.response.status === 404) { // Cart was already gone
				localStorage.removeItem("bigCommerceCartId");
				setCartId(null);
				setCart(null);
			}
		} finally {
			setLoading(false);
		}
	};

	const clearCart = async () => {
		setLoading(true);
		setError(null);
		const currentLocalCartId = cartId;
		if (currentLocalCartId) {
			try {
				await deleteBigCommerceCart(currentLocalCartId);
				// If successful, server-side cart is deleted.
			} catch (err) {
				console.error("Error deleting BigCommerce cart from server:", err);
				// If cart was already not found (404), that's fine.
				// For other errors, we set an error message but still clear client-side.
				if (!(err.response && err.response.status === 404)) {
					setError("Could not clear server cart, but cleared locally.");
				}
			}
		}
		// Always clear client-side cart state
		setCart(null);
		setCartId(null);
		localStorage.removeItem("bigCommerceCartId");
		setLoading(false);
	};

	const getCartTotalItems = () => {
		if (!cart || !cart.line_items || !cart.line_items.physical_items) return 0;
		return cart.line_items.physical_items.reduce(
			(total, item) => total + item.quantity,
			0
		);
	};

	const getCartSubtotal = () => {
		// Ensure base_amount exists and is a number, default to 0 otherwise
		if (!cart || typeof cart.base_amount !== 'number') return 0;
		return cart.base_amount;
	};

	const getRawCart = () => cart; // Exposes the full BigCommerce cart object

	return (
		<CartContext.Provider
			value={{
				cart, // The full BigCommerce cart object
				cartId,
				// Derived for compatibility with components expecting this structure
				cartItems: cart && cart.line_items && cart.line_items.physical_items ? cart.line_items.physical_items : [],
				addToCart,
				removeFromCart, // Expects BigCommerce line_item_id
				updateQuantity, // Expects BigCommerce line_item_id
				clearCart,
				getCartTotalItems,
				getCartSubtotal,
				getRawCart,
				loading,
				error,
				// Expose a way to manually trigger a cart refresh
				refreshCart: () => internalRefreshCart(cartId)
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
