import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';

const MinimalistProductCard = ({ product }) => {
	if (!product) {
		return null;
	}

	return (
		<div className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col justify-between h-full">
			<Link href={`/product/${product.id}`} className="flex flex-col flex-grow">
				<div className="relative">
					{product.images && product.images.length > 0 ? (
						<div className="w-full h-48 relative mb-4 rounded-md overflow-hidden">
							<Image
								src={product.images[0].url_standard}
								alt={product.name}
								fill
								objectFit="cover"
							/>
						</div>
					) : (
						<div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md mb-4">
							<span className="text-gray-500">No Image</span>
						</div>
					)}
					<h3 className="text-lg font-semibold text-gray-800 truncate flex-grow" title={product.name}>{product.name}</h3>
					<p className="text-md text-gray-600">${product.price}</p>
				</div>
			</Link>
			<div className="mt-auto pt-4">
				<AddToCartButton productId={product.id} />
			</div>
		</div>
	);
};

export default MinimalistProductCard;
