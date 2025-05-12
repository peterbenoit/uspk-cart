import { getProductById } from '@/lib/products';
import Breadcrumbs from '@/components/Breadcrumbs';
import AddToCartButton from '@/components/AddToCartButton';
import DetailedProductCard from '@/components/DetailedProductCard';

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
		return <p className="text-center text-red-500">Product not found.</p>;
	}

	const breadcrumbPath = [
		{ href: '/', name: 'Home' },
		{ href: '/product', name: 'Products' },
		{ href: `/product/${product.id}`, name: product.name },
	];

	return (
		<>
			<Breadcrumbs path={breadcrumbPath} />
			<div className="container mx-auto px-4 py-8">
				<DetailedProductCard product={product} />
				{/* <div className="mt-6 max-w-md mx-auto">
					<AddToCartButton productId={product.id} quantity={1} />
				</div> */}
			</div>
		</>
	);
}
