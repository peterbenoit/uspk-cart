import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";

export const metadata = {
	title: "Home – NextJS Commerce Template",
};

export default async function Home() {
	const products = await getAllProducts();

	return (
		<div className="py-8">
			<h1 className="text-2xl font-semibold mb-8 text-center">Featured Products</h1>
			{products && products.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{products.slice(0, 8).map((product) => ( // Display up to 8 products
						<div key={product.id} className="bg-white shadow-md rounded-lg overflow-hidden transition-all hover:shadow-xl">
							<Link href={`/product/${product.id}`} className="block">
								{product.image_url && (
									<img
										src={product.image_url}
										alt={product.name}
										className="w-full h-48 object-cover"
									/>
								)}
								<div className="p-4">
									<h2 className="text-lg font-medium text-gray-800 truncate" title={product.name}>
										{product.name}
									</h2>
									<p className="text-sm text-gray-500 mt-1">{product.category}</p>
									<p className="text-lg font-semibold text-indigo-600 mt-2">${product.price.toFixed(2)}</p>
								</div>
							</Link>
						</div>
					))}
				</div>
			) : (
				<p className="text-center text-gray-600">No products found.</p>
			)}
		</div>
	);
}
