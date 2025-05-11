import { products } from '@/lib/products';

export default function AdminPage() {
	return (
		<div className="py-8 max-w-6xl mx-auto px-4">
			<h1 className="text-3xl font-bold mb-6">Admin: Product List</h1>

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
