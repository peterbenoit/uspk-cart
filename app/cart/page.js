'use client';

import { useState } from 'react'; // Keep for operationInProgress
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation'; // Import useRouter
import Button from '../../components/Button'; // Assuming a Button component exists

export default function CartPage() {
	const {
		cart,
		loading: cartLoading,
		error: cartError,
		refreshCart,
		updateQuantity,
		removeFromCart,
		getCartSubtotal, // Add this
		getCartTotalItems // Add this
	} = useCart();

	const router = useRouter(); // Initialize useRouter
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
			// refreshCart(); // refreshCart is implicitly called by updateQuantity/removeFromCart in CartContext
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
			// refreshCart(); // refreshCart is implicitly called by removeFromCart in CartContext
		} catch (err) {
			console.error("Failed to remove item:", err);
			// Optionally, set a user-facing error message here
		} finally {
			setOperationInProgress({ itemId: null, type: null });
		}
	};

	const handleProceedToCheckout = () => {
		if (cart && cart.checkout_url) {
			window.location.href = cart.checkout_url; // Use window.location.href for external BigCommerce checkout
		} else {
			console.error('Checkout URL not available.');
			alert('Could not proceed to checkout. Please try again later.');
		}
	};

	if (cartLoading && !cart) {
		return <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">Loading cart...</div>;
	}

	if (cartError) {
		return <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-red-600">Error: {cartError.message || String(cartError) || 'Error loading cart.'} <button onClick={() => refreshCart()} className="ml-2 text-blue-500 underline">Try again</button></div>;
	}

	if (!cart || !cart.line_items || cart.line_items.physical_items.length === 0) {
		return (
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
				<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
				</svg>
				<h1 className="mt-2 text-2xl font-semibold text-gray-900">Your Cart is Empty</h1>
				<p className="mt-1 text-sm text-gray-500">Looks like you haven't added anything to your cart yet.</p>
				<div className="mt-6">
					<Link href="/" passHref>
						<Button variant="primary" size="large">
							Continue Shopping
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	const { physical_items } = cart.line_items;
	const subtotal = getCartSubtotal();
	const totalItems = getCartTotalItems();

	return (
		<div className="bg-gray-50 min-h-screen py-8">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 md:mb-12 text-center">Your Shopping Cart</h1>

				<div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16 items-start">
					<section aria-labelledby="cart-heading" className="lg:col-span-7 bg-white shadow-lg rounded-lg">
						<h2 id="cart-heading" className="sr-only">
							Items in your shopping cart
						</h2>

						<ul role="list" className="divide-y divide-gray-200">
							{physical_items.map((item) => (
								<li key={item.id} className="flex py-6 px-4 sm:px-6">
									<div className="flex-shrink-0">
										<Image
											src={item.image_url || '/images/default.jpg'}
											alt={item.name || 'Product image'}
											width={100}
											height={100}
											className="w-24 h-24 sm:w-32 sm:h-32 rounded-md object-cover object-center"
										/>
									</div>

									<div className="ml-4 sm:ml-6 flex-1 flex flex-col">
										<div>
											<div className="flex justify-between">
												<h3 className="text-base sm:text-lg font-medium text-gray-900">
													<Link href={`/product/${item.product_id}`} className="hover:text-indigo-600 transition-colors">
														{item.name}
													</Link>
												</h3>
												<p className="ml-4 text-base sm:text-lg font-medium text-gray-900">${item.sale_price.toFixed(2)}</p>
											</div>
											{item.options && item.options.length > 0 && (
												<p className="mt-1 text-sm text-gray-500">
													{item.options.map(opt => opt.value).join(', ')}
												</p>
											)}
										</div>

										<div className="flex-1 flex items-end justify-between mt-4">
											<div className="flex items-center">
												<label htmlFor={`quantity-${item.id}`} className="sr-only">
													Quantity, {item.name}
												</label>
												<select
													id={`quantity-${item.id}`}
													name={`quantity-${item.id}`}
													disabled={operationInProgress.itemId === item.id && operationInProgress.type === 'quantity'}
													onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
													value={item.quantity}
													className="text-sm border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
												>
													{[...Array(Math.min(10, item.quantity + 5)).keys()].map((x) => ( // Show up to 10 or current quantity + 5
														<option key={x + 1} value={x + 1}>
															{x + 1}
														</option>
													))}
													{item.quantity > 10 && <option value={item.quantity}>{item.quantity}</option>}
												</select>
												{(operationInProgress.itemId === item.id && operationInProgress.type === 'quantity') && <span className="ml-2 text-xs text-gray-500">Updating...</span>}
											</div>

											<div className="ml-4">
												<button
													type="button"
													disabled={operationInProgress.itemId === item.id && operationInProgress.type === 'remove'}
													onClick={() => handleRemoveItem(item.id)}
													className="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
												>
													<span>Remove</span>
													{(operationInProgress.itemId === item.id && operationInProgress.type === 'remove') && <span className="ml-1 text-xs">(Removing...)</span>}
												</button>
											</div>
										</div>
									</div>
								</li>
							))}
						</ul>
					</section>

					{/* Order summary */}
					<section
						aria-labelledby="summary-heading"
						className="mt-16 lg:mt-0 lg:col-span-5 bg-white shadow-lg rounded-lg p-6 sm:p-8"
					>
						<h2 id="summary-heading" className="text-xl sm:text-2xl font-semibold text-gray-900 border-b pb-4">
							Order Summary
						</h2>

						<dl className="mt-6 space-y-4">
							<div className="flex items-center justify-between">
								<dt className="text-sm text-gray-600">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</dt>
								<dd className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
							</div>
							{/* Add more summary lines if needed, e.g., shipping, taxes */}
							{/* <div className="flex items-center justify-between border-t border-gray-200 pt-4">
								<dt className="flex items-center text-sm text-gray-600">
									<span>Shipping estimate</span>
									<a href="#" className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500">
										<span className="sr-only">Learn more about how shipping is calculated</span>
										<svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
											<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
										</svg>
									</a>
								</dt>
								<dd className="text-sm font-medium text-gray-900">$5.00</dd>
							</div>
							<div className="flex items-center justify-between border-t border-gray-200 pt-4">
								<dt className="text-base font-medium text-gray-900">Order total</dt>
								<dd className="text-base font-medium text-gray-900">${(subtotal + 5).toFixed(2)}</dd>
							</div> */}
							<div className="border-t border-gray-200 pt-4 flex items-center justify-between">
								<dt className="text-base font-medium text-gray-900">Order total</dt>
								<dd className="text-base font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
							</div>
						</dl>

						<div className="mt-8">
							<Button
								onClick={handleProceedToCheckout}
								variant="primary"
								size="large"
								className="w-full"
								disabled={cartLoading || (operationInProgress.itemId !== null)}
							>
								{cartLoading || (operationInProgress.itemId !== null) ? 'Processing...' : 'Proceed to Checkout'}
							</Button>
						</div>

						<div className="mt-6 text-center text-sm">
							<p>
								or{' '}
								<Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
									Continue Shopping
									<span aria-hidden="true"> &rarr;</span>
								</Link>
							</p>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
