'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { products } from '@/lib/products';
import { supabase } from '@/lib/supabaseClient';

export default function AdminPage() {
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		async function checkSession() {
			const { data: { session } } = await supabase.auth.getSession();

			if (!session) {
				router.push('/login');
			} else {
				setLoading(false);
			}
		}

		checkSession();
	}, [router]);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-[50vh]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
			</div>
		);
	}

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.push('/login');
	};

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
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{products.map((product) => (
							<tr key={product.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
