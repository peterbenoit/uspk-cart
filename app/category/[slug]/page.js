import { getProductsByCategory } from '@/lib/products';

export default function CategoryPage({ params }) {
	// Get the category slug from params
	const { slug } = params;

	// Get products filtered by category
	const products = getProductsByCategory(slug);

	return (
		<div className="py-8">
			<h1 className="text-3xl font-bold mb-6">Products in: {slug}</h1>

			{products.length > 0 ? (
				<ul className="space-y-2 list-disc pl-5">
					{products.map(product => (
						<li key={product.id} className="text-gray-700">{product.name}</li>
					))}
				</ul>
			) : (
				<p className="text-gray-500">No products found in this category.</p>
			)}
		</div>
	);
}
