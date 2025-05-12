'use client';

import { useState } from 'react'; // Keep for operationInProgress
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
	const {
		cart,
		loading: cartLoading,
		error: cartError,
		refreshCart,
		updateQuantity,
		removeFromCart,
	} = useCart();

	const [operationInProgress, setOperationInProgress] = useState({ itemId: null, type: null }); // type: 'quantity' or 'remove'

	const handleUpdateQuantity = async (itemId, quantity) => {
		if (operationInProgress.itemId) return;

		setOperationInProgress({ itemId, type: 'quantity' });
		try {
			if (quantity === 0) {
				await removeFromCart(itemId);
			} else {
				await updateQuantity(itemId, quantity);
			}
			await refreshCart();
		} catch (err) {
			console.error("Failed to update quantity:", err);
			// Optionally, set a user-facing error message here
		} finally {
			setOperationInProgress({ itemId: null, type: null });
		}
	};

	const handleRemoveItem = async (itemId) => {
		if (operationInProgress.itemId) return;

		setOperationInProgress({ itemId, type: 'remove' });
		try {
			await removeFromCart(itemId);
			await refreshCart();
		} catch (err) {
			console.error("Failed to remove item:", err);
			// Optionally, set a user-facing error message here
		} finally {
			setOperationInProgress({ itemId: null, type: null });
		}
	};

	if (cartLoading && !cart) {
		return <div className="container mx-auto px-4 py-8 text-center">Loading cart...</div>;
	}

	if (cartError) {
		return <div className="container mx-auto px-4 py-8 text-center text-red-600">{cartError.message || String(cartError) || 'Error loading cart.'}</div>;
	}

	if (!cart || !cart.line_items || cart.line_items.physical_items.length === 0) {
		return (
			<div className="container mx-auto px-4 py-8 text-center">
				<h1 className="text-3xl font-bold mb-6">Your Cart is Empty</h1>
				<p className="mb-8">Looks like you haven't added anything to your cart yet.</p>
				<Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300">
					Continue Shopping
				</Link>
			</div>
		);
	}

	const { physical_items } = cart.line_items;
	const itemCount = physical_items.reduce((sum, item) => sum + item.quantity, 0);

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8 text-center">Your Shopping Cart</h1>

			<div className="bg-white shadow-xl rounded-lg overflow-hidden">
				<ul className="divide-y divide-gray-200">
					{physical_items.map((item) => (
						<li key={item.id} className="p-6 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
							<div className="w-24 h-24 relative flex-shrink-0">
								<Image
									src={item.image_url || '/images/default.jpg'}
									alt={item.name}
									layout="fill"
									objectFit="cover"
									className="rounded-md"
								/>
							</div>
							<div className="flex-grow text-center md:text-left">
								<h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
								{item.options && item.options.length > 0 && (
									<p className="text-sm text-gray-500">
										{item.options.map(opt => `${opt.name}: ${opt.value}`).join(', ')}
									</p>
								)}
							</div>
							<div className="flex flex-col items-center md:items-end space-y-3 md:space-y-2 mt-4 md:mt-0">
								<div className="flex items-center space-x-2">
									<button
										onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
										disabled={item.quantity <= 1 || operationInProgress.itemId === item.id}
										className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-md shadow-sm transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
										aria-label="Decrease quantity"
									>
										-
									</button>
									<span className="w-10 text-center text-lg text-gray-700">
										{operationInProgress.itemId === item.id && operationInProgress.type === 'quantity' ? '...' : item.quantity}
									</span>
									<button
										onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
										disabled={operationInProgress.itemId === item.id}
										className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-md shadow-sm transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
										aria-label="Increase quantity"
									>
										+
									</button>
								</div>
								<p className="text-xl font-semibold text-gray-800">
									${(item.extended_sale_price !== undefined ? item.extended_sale_price : (item.sale_price * item.quantity)).toFixed(2)}
								</p>
								<button
									onClick={() => handleRemoveItem(item.id)}
									disabled={operationInProgress.itemId === item.id}
									className="text-sm text-red-600 hover:text-red-800 font-medium transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{operationInProgress.itemId === item.id && operationInProgress.type === 'remove' ? 'Removing...' : 'Remove'}
								</button>
							</div>
						</li>
					))}
				</ul>

				<div className="p-6 bg-gray-50 border-t border-gray-200">
					<div className="flex justify-between items-center mb-4">
						<p className="text-xl text-gray-700">Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''}):</p>
						<p className="text-2xl font-bold text-gray-900">${cart.base_amount.toFixed(2)}</p>
					</div>
					<div className="flex justify-between items-center">
						<p className="text-xl text-gray-700">Total:</p>
						<p className="text-2xl font-bold text-gray-900">${cart.cart_amount.toFixed(2)}</p>
					</div>
					{cart.checkout_url && (
						<a
							href={cart.checkout_url}
							target="_blank"
							rel="noopener noreferrer"
							className="mt-6 w-full block text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 text-lg"
						>
							Proceed to Checkout
						</a>
					)}
				</div>
			</div>
		</div>
	);
}
