'use client';

import { useState } from 'react';
import Button from './Button';
import { useCart } from '@/context/CartContext'; // Import useCart

export default function AddToCartButton({ productId, quantity = 1, className = "bg-blue-600 hover:bg-blue-700 text-white", variantId = null }) { // Added variantId, though not used in this segment yet
	const [isLoading, setIsLoading] = useState(false);
	const [feedbackMessage, setFeedbackMessage] = useState(null); // For user feedback
	// const [error, setError] = useState(null); // Future use
	const { addToCart, cartError } = useCart(); // Get addToCart function and cartError from context

	const handleClick = async () => {
		setIsLoading(true);
		setFeedbackMessage(null);
		// setError(null); // Future use
		// console.log(`Adding product ${productId} to cart with quantity ${quantity}`);

		try {
			// Call the addToCart function from CartContext
			// The addToCart function in CartContext is responsible for:
			// - Checking if a cart exists (cartId in localStorage)
			// - Creating a cart if one doesn't exist and storing its ID
			// - Adding the item(s) to the cart
			// - Refreshing the cart state
			await addToCart(productId, quantity, variantId);
			setFeedbackMessage('Added to cart!'); // Success feedback
			// console.log('Product added to cart successfully via context');
		} catch (err) {
			console.error('Failed to add item to cart:', err);
			// setError(err.message || 'Failed to add item.'); // Future use
			setFeedbackMessage(cartError || err.message || 'Error adding item.'); // Show error from context or a generic one
		} finally {
			setIsLoading(false);
			// Clear feedback message after a few seconds
			setTimeout(() => {
				setFeedbackMessage(null);
			}, 3000);
		}
	};

	return (
		<>
			<Button
				onClick={handleClick}
				disabled={isLoading}
				className={`${className} w-full flex items-center justify-center`}
				data-testid={`add-to-cart-button-${productId}`}
			>
				{isLoading ? (
					<>
						<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Adding...
					</>
				) : (
					'Add to Cart'
				)}
			</Button>
			{feedbackMessage && (
				<p className={`mt-2 text-sm ${cartError || (feedbackMessage && feedbackMessage.toLowerCase().includes('error')) ? 'text-red-600' : 'text-green-600'}`}
					data-testid="add-to-cart-feedback"
				>
					{feedbackMessage}
				</p>
			)}
		</>
	);
}
