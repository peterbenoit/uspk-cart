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
				<ul className="space-y-1 list-none p-0">
					{products.map((product, index) => (
						<li key={product.id} className={`p-3 rounded-md transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}>
							<Link href={`/product/${product.id}`} className="text-blue-600 hover:underline font-medium">
								{product.name}
							</Link>
							<p className="text-sm text-gray-600 ml-1">{product.description}</p>
						</li>
					))}
				</ul>
			) : (
				<p>No products found in this category.</p>
			)}
		</div>
	);
}
