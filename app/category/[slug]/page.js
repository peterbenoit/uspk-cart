import { getProductsByCategory } from '@/lib/products';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
	return {
		title: `Category: ${(await params).slug}`,
	};
}

export default async function CategoryPage({ params }) {
	const slug = (await params).slug;

	// Get products filtered by category
	const products = await getProductsByCategory(slug);

	console.log('Products:', products, slug);

	if (!products || products.length === 0) {
		notFound();
	}

	return (
		<div className="py-8 max-w-3xl mx-auto">
			<h1 className="text-2xl font-semibold mb-6">Products in: {slug}</h1>

			{products && products.length > 0 ? (
				<ul className="space-y-2 list-none p-0">
					{products.map((product, index) => (
						<li key={product.id} className={`p-4 rounded-md transition-colors duration-150 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-indigo-50`}>
							<Link href={`/product/${product.id}`} className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium text-lg">
								{product.name}
							</Link>
							<p className="text-sm text-gray-600 ml-1 mt-1">{product.description}</p>
						</li>
					))}
				</ul>
			) : (
				<p>No products found in this category.</p>
			)}
		</div>
	);
}
