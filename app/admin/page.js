'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllProducts, updateProduct, createProduct } from '@/lib/products';
import { supabase } from '@/lib/supabaseClient';
import FormField from '@/components/FormField'; // Added import
import Button from '@/components/Button'; // Added import

export default function AdminPage() {
	const [loading, setLoading] = useState(true);
	const [products, setProducts] = useState([]);
	const [editingId, setEditingId] = useState(null);
	const [editForm, setEditForm] = useState({ name: '', category: '', description: '', price: 0, image_url: '', stock: 0 });
	const [newProductForm, setNewProductForm] = useState({
		name: '',
		category: '',
		description: '',
		price: 0,
		image_url: '',
		stock: 0
	});
	const [userEmail, setUserEmail] = useState('');
	const [error, setError] = useState(null); // Add error state
	const router = useRouter();

	// Force authentication check on every render to prevent unauthorized access
	useEffect(() => {
		// Reset loading state on every navigation to this page
		setLoading(true);
		setError(null); // Clear errors on navigation

		async function checkSessionAndLoadProducts() {
			// Clear any cached session data by getting a fresh session
			const { data: { session } } = await supabase.auth.getSession();

			if (!session) {
				// No valid session, redirect to login
				router.replace('/login'); // Changed from router.push
			} else {
				setUserEmail(session.user.email);
				try {
					const productsData = await getAllProducts();
					setProducts(productsData);
				} catch (error) {
					console.error('Error loading products:', error);
				} finally {
					setLoading(false);
				}
			}
		}

		checkSessionAndLoadProducts();
	}, [router]);

	const handleEditClick = (product) => {
		setEditingId(product.id);
		setEditForm({
			name: product.name,
			category: product.category,
			description: product.description,
			price: product.price,
			image_url: product.image_url,
			stock: product.stock
		});
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setEditForm({ name: '', category: '', description: '', price: 0, image_url: '', stock: 0 });
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditForm({
			...editForm,
			[name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
		});
	};

	const handleNewProductInputChange = (e) => {
		const { name, value } = e.target;
		setNewProductForm({
			...newProductForm,
			[name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
		});
	};

	const handleAddProduct = async (e) => {
		e.preventDefault();
		try {
			const createdProduct = await createProduct(newProductForm);
			if (createdProduct) {
				// Refresh the product list
				const updatedProducts = await getAllProducts();
				setProducts(updatedProducts);
				// Reset the form
				setNewProductForm({
					name: '',
					category: '',
					description: '',
					price: 0,
					image_url: '',
					stock: 0
				});
			}
		} catch (error) {
			console.error('Error adding product:', error);
		}
	};

	const handleSave = async (id) => {
		try {
			const updatedProduct = await updateProduct(id, editForm);
			if (updatedProduct) {
				// Update the products list with the updated product
				setProducts(
					products.map(product =>
						product.id === id ? updatedProduct : product
					)
				);
				setEditingId(null);
				setEditForm({ name: '', category: '', description: '', price: 0, image_url: '', stock: 0 });
			}
		} catch (error) {
			console.error('Error updating product:', error);
		}
	};

	const handleLogout = async () => {
		setLoading(true);
		setError(null);
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error('Error logging out:', error);
			setError(error.message);
			setLoading(false);
		} else {
			// Clear any client-side state
			setUserEmail('');
			setProducts([]);
			// Use router.replace instead of push to prevent back navigation
			router.replace('/login');
			// setLoading(false); // Not strictly needed if redirecting immediately
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-[50vh]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
			</div>
		);
	}

	return (
		<div className="py-8 max-w-6xl mx-auto px-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-semibold">Admin: Product List</h1>
				<div className="flex items-center space-x-4">
					<span className="text-sm text-gray-600">Logged in as: {userEmail}</span>
					<Button
						onClick={handleLogout}
						className="bg-gray-200 hover:bg-gray-300 text-gray-700"
					>
						Logout
					</Button>
				</div>
			</div>

			{error && ( // Display error if any
				<div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-md">
					<p>Error: {error}</p>
				</div>
			)}

			<div className="mb-8 bg-white shadow-md rounded-lg p-6">
				<h2 className="text-xl font-semibold mb-4">Add New Product</h2>
				<form onSubmit={handleAddProduct}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<FormField
							label="Name"
							id="new-name"
							name="name"
							value={newProductForm.name}
							onChange={handleNewProductInputChange}
							required
						/>
						<FormField
							label="Category"
							id="new-category"
							name="category"
							value={newProductForm.category}
							onChange={handleNewProductInputChange}
							required
						/>
						<FormField
							label="Description"
							id="new-description"
							name="description"
							type="textarea"
							rows={3}
							value={newProductForm.description}
							onChange={handleNewProductInputChange}
						/>
						<FormField
							label="Image URL"
							id="new-image_url"
							name="image_url"
							value={newProductForm.image_url}
							onChange={handleNewProductInputChange}
						/>
						<FormField
							label="Price ($)"
							id="new-price"
							name="price"
							type="number"
							value={newProductForm.price}
							onChange={handleNewProductInputChange}
							step="0.01"
							min="0"
							required
						/>
						<FormField
							label="Stock"
							id="new-stock"
							name="stock"
							type="number"
							value={newProductForm.stock}
							onChange={handleNewProductInputChange}
							min="0"
							required
						/>
					</div>
					<div className="mt-6">
						<Button type="submit">
							Add Product
						</Button>
					</div>
				</form>
			</div>

			<div className="overflow-x-auto bg-white shadow-md rounded-lg">
				<table className="min-w-full table-auto">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{products.map((product) => (
							<tr key={product.id} className="hover:bg-gray-50 transition-colors">
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
								{editingId === product.id ? (
									<>
										<td className="px-6 py-4 whitespace-nowrap">
											<FormField
												id={`edit-name-${product.id}`}
												name="name"
												value={editForm.name}
												onChange={handleInputChange}
												className="text-sm"
											/>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<FormField
												id={`edit-category-${product.id}`}
												name="category"
												value={editForm.category}
												onChange={handleInputChange}
												className="text-sm"
											/>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<FormField
												id={`edit-description-${product.id}`}
												name="description"
												type="textarea"
												rows={2}
												value={editForm.description}
												onChange={handleInputChange}
												className="text-sm"
											/>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<FormField
												id={`edit-price-${product.id}`}
												name="price"
												type="number"
												value={editForm.price}
												onChange={handleInputChange}
												step="0.01"
												min="0"
												className="text-sm"
											/>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<FormField
												id={`edit-stock-${product.id}`}
												name="stock"
												type="number"
												value={editForm.stock}
												onChange={handleInputChange}
												min="0"
												className="text-sm"
											/>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
											<Button onClick={() => handleSave(product.id)} className="bg-green-500 hover:bg-green-600 text-white">
												Save
											</Button>
											<Button onClick={handleCancelEdit} className="bg-gray-200 hover:bg-gray-300 text-gray-700">
												Cancel
											</Button>
										</td>
									</>
								) : (
									<>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.name}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.category}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 truncate max-w-xs">{product.description}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${product.price.toFixed(2)}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.stock}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm">
											<Button onClick={() => handleEditClick(product)} className="bg-blue-500 hover:bg-blue-600 text-white">
												Edit
											</Button>
										</td>
									</>
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
