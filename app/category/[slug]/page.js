import { getProductsByCategory } from '@/lib/products';
import Link from 'next/link';

export default async function CategoryPage({ params }) {
	const resolvedParams = await params;
	const slug = resolvedParams.slug;

	// Get products filtered by category
	const products = await getProductsByCategory(slug);

	return (
		<div className="py-8">
			<h1 className="text-3xl font-bold mb-6">Products in: {slug}</h1>

			{products && products.length > 0 ? (
				<ul className="space-y-2 list-disc pl-5">
					{products.map(product => (
						<li key={product.id} className="text-gray-700">
							<Link href={`/product/${product.id}`} className="text-blue-500 hover:underline">
								{product.name}
							</Link>
							<span className="text-sm text-gray-500 ml-2">({product.description})</span>
						</li>
					))}
				</ul>
			) : (
				<p>No products found in this category.</p>
			)}
		</div>
	);
}
