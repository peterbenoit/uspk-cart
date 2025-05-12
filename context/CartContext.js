"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
	const [cartItems, setCartItems] = useState([]);

	// Load cart from localStorage on initial render
	useEffect(() => {
		try {
			const localCart = localStorage.getItem("cart");
			if (localCart) {
				setCartItems(JSON.parse(localCart));
			}
		} catch (error) {
			console.error("Failed to parse cart from localStorage", error);
			// Optionally clear localStorage if parsing fails
			// localStorage.removeItem("cart");
		}
	}, []);

	// Save cart to localStorage whenever it changes
	useEffect(() => {
		if (cartItems.length > 0 || localStorage.getItem("cart")) { // Only save if cart has items or was previously saved
			localStorage.setItem("cart", JSON.stringify(cartItems));
		}
	}, [cartItems]);

	const addToCart = (productId, quantity = 1) => {
		setCartItems((prevItems) => {
			const existingItem = prevItems.find((item) => item.productId === productId);
			if (existingItem) {
				return prevItems.map((item) =>
					item.productId === productId
						? { ...item, quantity: item.quantity + quantity }
						: item
				);
			}
			return [...prevItems, { productId, quantity }];
		});
	};

	const removeFromCart = (productId) => {
		setCartItems((prevItems) =>
			prevItems.filter((item) => item.productId !== productId)
		);
	};

	const updateQuantity = (productId, quantity) => {
		if (quantity <= 0) {
			removeFromCart(productId);
		} else {
			setCartItems((prevItems) =>
				prevItems.map((item) =>
					item.productId === productId ? { ...item, quantity } : item
				)
			);
		}
	};

	const clearCart = () => {
		setCartItems([]);
		localStorage.removeItem("cart"); // Also clear from localStorage
	};

	const getCartTotalItems = () => {
		return cartItems.reduce((total, item) => total + item.quantity, 0);
	};

	return (
		<CartContext.Provider
			value={{
				cartItems,
				addToCart,
				removeFromCart,
				updateQuantity,
				clearCart,
				getCartTotalItems,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
