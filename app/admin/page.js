'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllProducts, updateProduct } from '@/lib/products';
import { supabase } from '@/lib/supabaseClient';

export default function AdminPage() {
	const [loading, setLoading] = useState(true);
	const [products, setProducts] = useState([]);
	const [editingId, setEditingId] = useState(null);
	const [editForm, setEditForm] = useState({ name: '', category: '', description: '', price: 0, image_url: '', stock: 0 });
	const router = useRouter();

	useEffect(() => {
		async function checkSessionAndLoadProducts() {
			const { data: { session } } = await supabase.auth.getSession();

			if (!session) {
				router.push('/login');
			} else {
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
		await supabase.auth.signOut();
		router.push('/login');
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
				<h1 className="text-3xl font-bold">Admin: Product List</h1>
				<button
					onClick={handleLogout}
					className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
				>
					Logout
				</button>
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
							<tr key={product.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
								{editingId === product.id ? (
									<>
										<td className="px-6 py-4 whitespace-nowrap">
											<input
												type="text"
												name="name"
												value={editForm.name}
												onChange={handleInputChange}
												className="border rounded px-2 py-1 w-full"
											/>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<input
												type="text"
												name="category"
												value={editForm.category}
												onChange={handleInputChange}
												className="border rounded px-2 py-1 w-full"
											/>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<input
												type="text"
												name="description"
												value={editForm.description}
												onChange={handleInputChange}
												className="border rounded px-2 py-1 w-full"
											/>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<input
												type="number"
												name="price"
												value={editForm.price}
												onChange={handleInputChange}
												className="border rounded px-2 py-1 w-full"
												step="0.01"
											/>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<input
												type="number"
												name="stock"
												value={editForm.stock}
												onChange={handleInputChange}
												className="border rounded px-2 py-1 w-full"
											/>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
											<button
												onClick={() => handleSave(product.id)}
												className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded"
											>
												Save
											</button>
											<button
												onClick={handleCancelEdit}
												className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
											>
												Cancel
											</button>
										</td>
									</>
								) : (
									<>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.description}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price?.toFixed(2)}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<button
												onClick={() => handleEditClick(product)}
												className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded"
											>
												Edit
											</button>
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
