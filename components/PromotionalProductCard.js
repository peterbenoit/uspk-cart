import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';

const PromotionalProductCard = ({ product, promotion }) => {
	if (!product) {
		return null;
	}

	let promotionBadge = null;
	if (promotion) {
		let badgeColor = 'bg-green-500'; // Default for "New Arrival"
		if (promotion.toLowerCase().includes('sale')) {
			badgeColor = 'bg-red-500';
		} else if (promotion.toLowerCase().includes('featured')) {
			badgeColor = 'bg-yellow-500';
		}

		promotionBadge = (
			<div className={`absolute top-2 right-2 ${badgeColor} text-white text-xs font-bold px-2 py-1 rounded`}>
				{promotion}
			</div>
		);
	}


	return (
		<div className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out relative flex flex-col justify-between h-full">
			<div>
				{promotionBadge}
				<Link href={`/product/${product.id}`}>
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
						<h3 className="text-lg font-semibold text-gray-800 truncate" title={product.name}>{product.name}</h3>
						<p className="text-md text-gray-600 mb-2">${product.price}</p>
					</div>
				</Link>
			</div>
			<div className="mt-auto pt-2">
				<AddToCartButton productId={product.id} />
			</div>
		</div>
	);
};

export default PromotionalProductCard;
