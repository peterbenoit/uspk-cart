import { getProductById } from '@/lib/products';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
	const product = await getProductById((await params).id);
	return {
		title: product ? product.name : 'Product Not Found',
	};
}

export default async function ProductDetailPage({ params }) {
	const id = (await params).id;

	const product = await getProductById(id);

	if (!product) {
		notFound();
	}

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
						<span className="bg-gray-100 text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded">
							{product.category}
						</span>
					</div>
					<p className="text-gray-700 mb-6">{product.description}</p>

					{product.price && (
						<p className="text-2xl font-bold text-green-600 mb-4">
							${product.price.toFixed(2)}
						</p>
					)}

					{product.stock !== undefined && (
						<p className="text-sm text-gray-500">
							{product.stock > 0 ? `In stock: ${product.stock}` : 'Out of stock'}
						</p>
					)}

					<button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
						Add to Cart
					</button>
				</div>
			) : (
				<div className="bg-white shadow-md rounded-lg p-6">
					<h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
					<p>Sorry, we couldn't find the product you're looking for.</p>
				</div>
			)}
		</div>
	);
}
