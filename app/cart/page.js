'use client';

import { useState, useEffect } from 'react'; // MODIFIED: Added useEffect
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext'; // ADDED
import Button from '../../components/Button';

export default function CartPage() {
	const {
		cart,
		loading: cartLoading,
		error: cartError,
		// refreshCart, // Not directly used as context functions handle refresh
		updateQuantity,
		removeFromCart,
		getCartSubtotal,
		getCartTotalItems // Corrected comma
	} = useCart();

	const router = useRouter();
	const [operationInProgress, setOperationInProgress] = useState({}); // MODIFIED: per-item operation status e.g. {itemId: 'update' | 'remove'}
	const [itemQuantities, setItemQuantities] = useState({}); // ADDED: for controlled quantity inputs

	// Initialize or update local item quantities when the cart changes
	useEffect(() => {
		if (cart && cart.line_items && cart.line_items.physical_items) {
			const initialQuantities = {};
			cart.line_items.physical_items.forEach(item => {
				initialQuantities[item.id] = item.quantity;
			});
			setItemQuantities(initialQuantities);
		} else {
			setItemQuantities({}); // Clear if cart is empty or not loaded
		}
	}, [cart]);

	const handleUpdateQuantity = async (itemId, quantity) => {
		if (operationInProgress[itemId]) return; // Prevent multiple operations on the same item

		// Safeguard, though input onChange should prevent negative values in itemQuantities state
		if (quantity < 0) {
			console.warn("Quantity cannot be negative. Resetting input.");
			// Revert local state to actual cart quantity if input was invalid
			if (cart && cart.line_items && cart.line_items.physical_items) {
				const currentItem = cart.line_items.physical_items.find(i => i.id === itemId);
				if (currentItem) {
					setItemQuantities(prev => ({ ...prev, [itemId]: currentItem.quantity }));
				}
			}
			return;
		}

		setOperationInProgress(prev => ({ ...prev, [itemId]: 'update' }));
		try {
			// updateQuantity in CartContext handles quantity === 0 by calling removeFromCart
			await updateQuantity(itemId, quantity);
			// itemQuantities will be updated by useEffect when cart refreshes
		} catch (err) {
			console.error(`Failed to update quantity for item ${itemId}:`, err);
			// Optionally, show an error to the user. CartContext might set a global error.
			// Revert local quantity to cart quantity on error to ensure consistency
			if (cart && cart.line_items && cart.line_items.physical_items) {
				const currentItem = cart.line_items.physical_items.find(i => i.id === itemId);
				if (currentItem) {
					setItemQuantities(prev => ({ ...prev, [itemId]: currentItem.quantity }));
				}
			}
		} finally {
			setOperationInProgress(prev => {
				const newState = { ...prev };
				delete newState[itemId];
				return newState;
			});
		}
	};

	const handleRemoveItem = async (itemId) => {
		if (operationInProgress[itemId]) return;
		setOperationInProgress(prev => ({ ...prev, [itemId]: 'remove' }));
		try {
			await removeFromCart(itemId);
			// itemQuantities for this item will be implicitly handled as the item disappears or useEffect updates it.
		} catch (err) {
			console.error(`Failed to remove item ${itemId}:`, err);
			// Optionally, show an error to the user.
		} finally {
			setOperationInProgress(prev => {
				const newState = { ...prev };
				delete newState[itemId];
				return newState;
			});
		}
	};

	const handleProceedToCheckout = () => {
		if (cart && cart.redirect_urls && cart.redirect_urls.checkout_url) {
			window.location.href = cart.redirect_urls.checkout_url; // Use window.location for external redirect
		} else {
			console.warn("Checkout URL not available in cart object.");
			alert("Could not proceed to checkout. Please try again or contact support.");
		}
	};

	const formatCurrency = (amount, currencyCode = 'USD') => {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amount);
	};

	if (cartLoading && !cart) {
		return <div className="container mx-auto p-4 text-center">Loading cart...</div>;
	}

	if (cartError) {
		return <div className="container mx-auto p-4 text-center text-red-500">Error loading cart: {cartError.message || String(cartError)}</div>;
	}

	if (!cart || !cart.line_items || !cart.line_items.physical_items || cart.line_items.physical_items.length === 0) {
		return (
			<div className="container mx-auto p-4 text-center">
				<h1 className="text-2xl font-semibold mb-4">Your Cart is Empty</h1>
				<Button onClick={() => router.push('/')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
					Continue Shopping
				</Button>
			</div>
		);
	}

	const { physical_items } = cart.line_items;
	const subtotal = getCartSubtotal();
	const totalItems = getCartTotalItems();
	const currency = cart.currency && cart.currency.code ? cart.currency.code : 'USD'; // Ensure currency code is available, default to USD

	// Ensure subtotal is a valid number before formatting
	const formattedSubtotal = typeof subtotal === 'number' ? formatCurrency(subtotal, currency) : 'N/A';

	return (
		<div className="container mx-auto p-4 sm:p-6 lg:p-8">
			<h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Your Shopping Cart</h1>

			<div className="space-y-4">
				{physical_items.map(item => (
					<div key={item.id} className="flex flex-col md:flex-row justify-between items-start md:items-center border rounded-lg p-4 shadow-sm bg-white">
						<div className="flex items-center mb-4 md:mb-0 w-full md:w-auto flex-grow">
							{item.image_url && (
								<img
									src={item.image_url}
									alt={item.name}
									className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md mr-4 border hover:opacity-80 transition-opacity"
									onClick={() => router.push(`/product/${item.product_id}`)}
									style={{ cursor: 'pointer' }}
								/>
							)}
							<div className="flex-grow">
								<h2
									className="text-md sm:text-lg font-semibold text-gray-700 hover:text-blue-600 cursor-pointer transition-colors"
									onClick={() => router.push(`/product/${item.product_id}`)}
								>
									{item.name}
								</h2>
								{item.sku && <p className="text-xs sm:text-sm text-gray-500">SKU: {item.sku}</p>}
								<p className="text-xs sm:text-sm text-gray-600">Unit Price: {formatCurrency(item.sale_price, currency)}</p>
								<p className="text-xs sm:text-sm text-gray-500 mt-1" id={`item-total-${item.id}`}>Item Total: {formatCurrency(item.sale_price * item.quantity, currency)}</p>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 self-start md:self-center w-full md:w-auto mt-2 md:mt-0">
							<div className="flex items-center space-x-1 sm:space-x-2">
								<label htmlFor={`quantity-${item.id}`} className="text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">Qty:</label>
								<input
									type="number"
									id={`quantity-${item.id}`}
									name={`quantity-${item.id}`}
									min="0"
									value={itemQuantities[item.id] !== undefined ? itemQuantities[item.id] : ''} // Show empty if undefined, otherwise the number
									onChange={(e) => {
										const val = e.target.value;
										const newQuantity = val === '' ? 0 : parseInt(val, 10);
										if (val === '' || (!isNaN(newQuantity) && newQuantity >= 0)) {
											setItemQuantities(prev => ({ ...prev, [item.id]: newQuantity }));
										} else if (!isNaN(newQuantity) && newQuantity < 0) {
											setItemQuantities(prev => ({ ...prev, [item.id]: 0 })); // Correct negative to 0
										}
									}}
									disabled={!!operationInProgress[item.id]}
									className="w-16 sm:w-20 p-1 sm:p-2 border rounded text-center focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
									aria-describedby={`item-total-${item.id}`}
								/>
								<Button
									onClick={() => {
										if (itemQuantities[item.id] !== undefined) { // Ensure quantity is set before updating
											handleUpdateQuantity(item.id, itemQuantities[item.id]);
										}
									}}
									disabled={
										!!operationInProgress[item.id] ||
										itemQuantities[item.id] === undefined ||
										itemQuantities[item.id] === item.quantity // No change to update
									}
									className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
								>
									{operationInProgress[item.id] === 'update' ? '...' : 'Update'}
								</Button>
							</div>
							<Button
								onClick={() => handleRemoveItem(item.id)}
								disabled={!!operationInProgress[item.id]}
								className={`w-full sm:w-auto px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm ${operationInProgress[item.id] === 'remove' ? 'bg-red-300' : 'bg-red-500 hover:bg-red-600'} text-white rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed`}
							>
								{operationInProgress[item.id] === 'remove' ? '...' : 'Remove'}
							</Button>
						</div>
						<div className="text-right md:text-left mt-2 md:mt-0 w-full md:w-auto md:pl-4 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-gray-200">
							<p id={`item-total-${item.id}`} className="text-sm sm:text-md font-semibold text-gray-700 whitespace-nowrap">
								Item Total: {formatCurrency(item.sale_price * item.quantity, currency)}
							</p>
						</div>
					</div>
				))}
			</div>

			<div className="mt-6 p-4 border-t bg-gray-50 rounded-lg shadow">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
				<div className="space-y-2">
					<div className="flex justify-between">
						<span className="text-gray-600">Total Items:</span>
						<span className="font-medium text-gray-700">{totalItems}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-600">Subtotal:</span>
						<span className="font-medium text-gray-700">{formattedSubtotal}</span>
					</div>
					{/* Add more summary lines like shipping, taxes if available */}
					<div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t mt-2">
						<span>Grand Total:</span>
						<span>{formattedSubtotal}</span>{/* Assuming subtotal is grand total for now */}
					</div>
				</div>
				<Button
					onClick={handleProceedToCheckout}
					disabled={cartLoading || totalItems === 0 || (cart && !cart.redirect_urls?.checkout_url)}
					className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
				>
					Proceed to Checkout
				</Button>
			</div>
		</div>
	);
}
