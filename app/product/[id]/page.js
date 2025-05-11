import { getProductById } from '@/lib/products';
import Link from 'next/link';

export default function ProductDetailPage({ params }) {
	// Get the product ID from params
	const { id } = params;

	// Fetch the product data using the ID
	const product = getProductById(id);

	return (
		<div className="py-8 max-w-4xl mx-auto">
			<Link
				href="/"
				className="text-blue-500 mb-8 inline-block hover:underline"
			>
				&larr; Back to Home
			</Link>

			{product ? (
				<div className="bg-white shadow-md rounded-lg p-6">
					<h1 className="text-3xl font-bold mb-4">{product.name}</h1>
					<div className="mb-4">
						<span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
							{product.category}
						</span>
					</div>
					<p className="text-gray-700">{product.description}</p>
				</div>
			) : (
				<div className="bg-red-50 border border-red-200 rounded-lg p-6">
					<h1 className="text-xl font-medium text-red-700">Product not found</h1>
					<p className="text-red-500 mt-2">The product with ID '{id}' does not exist.</p>
				</div>
			)}
		</div>
	);
}
