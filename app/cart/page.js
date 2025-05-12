'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
	const {
		cart,
		loading: cartLoading,
		error: cartError,
		cartExpired,
		resetCartError,
		updateQuantity,
		removeFromCart,
		getCartSubtotal,
		getCartTotalItems,
		getCheckoutUrl,
	} = useCart();

	const router = useRouter();
	const [operationInProgress, setOperationInProgress] = useState({});
	const [itemQuantities, setItemQuantities] = useState({});
	const [checkoutError, setCheckoutError] = useState(null);

	// Initialize or update local item quantities when the cart changes
	useEffect(() => {
		if (cart && cart.line_items && cart.line_items.physical_items) {
			const initialQuantities = cart.line_items.physical_items.reduce((acc, item) => {
				acc[item.id] = item.quantity;
				return acc;
			}, {});
			setItemQuantities(initialQuantities);
		}
	}, [cart]);

	const handleUpdateQuantity = async (itemId, quantity) => {
		if (quantity < 1) return; // Prevent quantity less than 1
		setOperationInProgress(prev => ({ ...prev, [itemId]: 'updating' }));
		resetCartError(); // Clear previous errors
		setCheckoutError(null);
		try {
			await updateQuantity(itemId, quantity);
			// Update local state immediately for responsiveness
			setItemQuantities(prev => ({ ...prev, [itemId]: quantity }));
		} catch (error) {
			console.error("Error updating quantity:", error);
			// Error is handled by CartContext and displayed via cartError
		} finally {
			setOperationInProgress(prev => ({ ...prev, [itemId]: false }));
		}
	};

	const handleRemoveItem = async (itemId) => {
		setOperationInProgress(prev => ({ ...prev, [itemId]: 'removing' }));
		resetCartError(); // Clear previous errors
		setCheckoutError(null);
		try {
			await removeFromCart(itemId);
		} catch (error) {
			console.error("Error removing item:", error);
			// Error is handled by CartContext and displayed via cartError
		} finally {
			setOperationInProgress(prev => ({ ...prev, [itemId]: false }));
		}
	};

	const handleProceedToCheckout = async () => {
		resetCartError();
		setCheckoutError(null); // Clear previous checkout errors
		setOperationInProgress(prev => ({ ...prev, checkout: true }));

		if (cartExpired) {
			setCheckoutError("Your cart has expired. Please add items again.");
			setOperationInProgress(prev => ({ ...prev, checkout: false }));
			return;
		}
		if (!cart || !cart.id) {
			setCheckoutError("Your cart is empty or invalid. Please add items to your cart.");
			setOperationInProgress(prev => ({ ...prev, checkout: false }));
			return;
		}

		try {
			const checkoutUrl = await getCheckoutUrl();
			if (checkoutUrl) {
				router.push(checkoutUrl);
			} else {
				// Error state will be set by getCheckoutUrl in CartContext if URL is null
				// but we can set a more specific one here if needed or rely on cartError
				setCheckoutError("Could not retrieve checkout URL. Please try again or contact support.");
			}
		} catch (error) {
			console.error("Error proceeding to checkout:", error);
			setCheckoutError(error.message || "An unexpected error occurred while proceeding to checkout.");
		} finally {
			setOperationInProgress(prev => ({ ...prev, checkout: false }));
		}
	};

	const formatCurrency = (amount, currencyCode = 'USD') => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currencyCode,
		}).format(amount);
	};

	if (cartLoading && !cart && !cartExpired) {
		return <div className="text-center py-10">Loading cart...</div>;
	}

	// Handle cartExpired state first
	if (cartExpired) {
		return (
			<div className="container mx-auto px-4 py-8 text-center">
				<h1 className="text-2xl font-semibold mb-4">Cart Expired</h1>
				<p className="mb-4">Your shopping cart has expired. Please try adding items again.</p>
				{/* Optionally, provide a button to start a new cart or go to homepage */}
				<button
					onClick={() => router.push('/')}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Go to Homepage
				</button>
			</div>
		);
	}


	if (cartError && !checkoutError) { // Only display general cart error if no specific checkout error
		return (
			<div className="container mx-auto px-4 py-8 text-center">
				<h1 className="text-2xl font-semibold mb-4 text-red-600">Error</h1>
				<p className="mb-4">{cartError}</p>
				<button
					onClick={() => {
						resetCartError();
						// Potentially try to refresh or re-initialize cart here if applicable
						// For now, just clear error and let user decide next action or navigate away
					}}
					className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
				>
					Try Again
				</button>
			</div>
		);
	}

	if (!cart || !cart.line_items || !cart.line_items.physical_items || cart.line_items.physical_items.length === 0) {
		return (
			<div className="container mx-auto px-4 py-8 text-center">
				<h1 className="text-2xl font-semibold mb-4">Your Cart is Empty</h1>
				<p className="mb-4">Looks like you haven't added anything to your cart yet.</p>
				<button
					onClick={() => router.push('/')}
					className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
				>
					Continue Shopping
				</button>
			</div>
		);
	}

	const { physical_items } = cart.line_items;
	const subtotal = getCartSubtotal();
	const totalItems = getCartTotalItems();
	const currency = cart.currency && cart.currency.code ? cart.currency.code : 'USD';
	// Ensure subtotal is a valid number before formatting
	const formattedSubtotal = typeof subtotal === 'number' ? formatCurrency(subtotal, currency) : 'N/A';

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6 text-center">Your Shopping Cart</h1>

			{checkoutError && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
					<strong className="font-bold">Checkout Error: </strong>
					<span className="block sm:inline">{checkoutError}</span>
				</div>
			)}
			{cartError && !checkoutError && ( // Display general cart error if no specific checkout error
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
					<strong className="font-bold">Error: </strong>
					<span className="block sm:inline">{cartError}</span>
					<button onClick={resetCartError} className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm">
						Dismiss
					</button>
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div className="md:col-span-2">
					{physical_items.map((item) => (
						<div key={item.id} className="flex items-center border-b py-4">
							<img src={item.image_url || '/images/default.jpg'} alt={item.name} className="w-20 h-20 object-cover rounded mr-4" />
							<div className="flex-grow">
								<h2 className="text-lg font-semibold">{item.name}</h2>
								<p className="text-sm text-gray-600">SKU: {item.sku || 'N/A'}</p>
								<p className="text-sm text-gray-600">Price: {formatCurrency(item.sale_price, currency)}</p>
							</div>
							<div className="flex items-center">
								<input
									type="number"
									min="1"
									value={itemQuantities[item.id] || item.quantity}
									onChange={(e) => {
										const newQuantity = parseInt(e.target.value, 10);
										setItemQuantities(prev => ({ ...prev, [item.id]: newQuantity }));
										if (newQuantity > 0) {
											// Debounce or delay update if preferred
											handleUpdateQuantity(item.id, newQuantity);
										}
									}}
									onBlur={(e) => { // Ensure update on blur if value changed but not submitted by enter/button
										const newQuantity = parseInt(e.target.value, 10);
										if (newQuantity > 0 && newQuantity !== item.quantity) {
											handleUpdateQuantity(item.id, newQuantity);
										} else if (newQuantity <= 0) { // Reset to original if invalid on blur
											setItemQuantities(prev => ({ ...prev, [item.id]: item.quantity }));
										}
									}}
									className="w-16 text-center border rounded mx-2"
									disabled={operationInProgress[item.id] === 'updating' || operationInProgress[item.id] === 'removing'}
								/>
								<button
									onClick={() => handleRemoveItem(item.id)}
									className="text-red-500 hover:text-red-700 disabled:opacity-50"
									disabled={operationInProgress[item.id] === 'removing' || operationInProgress[item.id] === 'updating'}
								>
									{operationInProgress[item.id] === 'removing' ? 'Removing...' : 'Remove'}
								</button>
							</div>
						</div>
					))}
				</div>

				<div className="md:col-span-1 bg-gray-50 p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-4">Order Summary</h2>
					<div className="flex justify-between mb-2">
						<span>Subtotal ({totalItems} items)</span>
						<span>{formattedSubtotal}</span>
					</div>
					{/* Add more summary details like estimated tax, shipping if available */}
					<div className="border-t mt-4 pt-4">
						<div className="flex justify-between font-bold text-lg">
							<span>Total</span>
							<span>{formattedSubtotal}</span> {/* Assuming total is same as subtotal for now */}
						</div>
					</div>
					<button
						onClick={handleProceedToCheckout}
						disabled={operationInProgress.checkout || cartLoading} // REMOVED isMutating from useCart
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded mt-6 disabled:opacity-70"
					>
						{operationInProgress.checkout ? 'Processing...' : 'Go to Checkout'}
					</button>
					{cart && cart.id && (
						<p className="text-xs text-gray-500 mt-2 text-center">Cart ID: {cart.id}</p>
					)}
				</div>
			</div>
		</div>
	);
}
