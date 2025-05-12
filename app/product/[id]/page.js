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
		<div className="py-8 max-w-3xl mx-auto">
			<div className="bg-white shadow-md rounded-lg p-6">
				<h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
				<p className="text-sm text-gray-500 mb-4">
					Category: <Link href={`/category/${product.category}`} className="text-indigo-600 hover:underline">{product.category}</Link>
				</p>
				{product.image_url && (
					<img src={product.image_url} alt={product.name} className="w-full h-64 object-cover rounded-md mb-4" />
				)}
				<p className="text-gray-700 mb-4">{product.description}</p>
				<div className="flex justify-between items-center">
					<p className="text-xl font-bold text-indigo-600">${product.price.toFixed(2)}</p>
					<p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
						{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
					</p>
				</div>
			</div>
		</div>
	);
}
