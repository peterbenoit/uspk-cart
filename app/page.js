import { getAllProducts } from "@/lib/products";
import MinimalistProductCard from "@/components/MinimalistProductCard"; // Import the component

export const metadata = {
	title: "USPK - Home",
	description: "Welcome to USPK, your one-stop shop for all your product needs. Explore our wide range of products and find the perfect fit for you.",
	keywords: ["USPK", "products", "shopping", "e-commerce"],
	authors: [{ name: "USPK Team", url: "https://www.uspk.com" }],
	openGraph: {
		title: "USPK - Home",
		description: "Welcome to USPK, your one-stop shop for all your product needs. Explore our wide range of products and find the perfect fit for you.",
		url: "https://www.uspk.com",
		type: "website",
		images: [
			{
				url: "/images/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "USPK - Home",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "USPK - Home",
		description: "Welcome to USPK, your one-stop shop for all your product needs. Explore our wide range of products and find the perfect fit for you.",
		images: ["/images/twitter-image.jpg"],
	},
};

export default async function Home() {
	const products = await getAllProducts();

	return (
		<div className="py-8">
			<h1 className="text-2xl font-semibold mb-8 text-center">Featured Products</h1>
			{products && products.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{products.slice(0, 8).map((product) => (
						<MinimalistProductCard key={product.id} product={product} />
					))}
				</div>
			) : (
				<p className="text-center text-gray-600">No products found.</p>
			)}
		</div>
	);
}
