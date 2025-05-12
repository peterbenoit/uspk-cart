'use client';

import { useState } from 'react';
import Button from './Button';

export default function AddToCartButton({ productId, quantity = 1, className = "bg-blue-600 hover:bg-blue-700 text-white" }) {
	const [isLoading, setIsLoading] = useState(false);
	// const [error, setError] = useState(null); // Future use

	const handleClick = async () => {
		setIsLoading(true);
		// setError(null); // Future use
		console.log(`Adding product ${productId} to cart with quantity ${quantity}`);
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 1000));
		alert(`Product ${productId} (Quantity: ${quantity}) added to cart (simulated).`);
		setIsLoading(false);
	};

	return (
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
	);
}
