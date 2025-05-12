import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';

const DetailedProductCard = ({ product }) => {
	if (!product) {
		return null;
	}

	// Function to strip HTML tags for a plain text description
	const stripHtml = (html) => {
		if (typeof window === 'undefined') {
			// On the server, or if DOMParser is not available, return a simple stripped version or placeholder
			return html.replace(/<[^>]*>?/gm, '');
		}
		const doc = new DOMParser().parseFromString(html, 'text/html');
		return doc.body.textContent || "";
	};

	const descriptionSnippet = product.description ? stripHtml(product.description).substring(0, 100) + '...' : 'No description available.';

	return (
		<div className="border rounded-lg p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out bg-white flex flex-col justify-between h-full">
			<Link href={`/product/${product.id}`} className="flex flex-col flex-grow">
				<div className="relative">
					{product.images && product.images.length > 0 ? (
						<div className="w-full h-56 relative mb-4 rounded-lg overflow-hidden">
							<Image
								src={product.images[0].url_standard}
								alt={product.name}
								fill
								objectFit="cover"
								className="transform hover:scale-105 transition-transform duration-300"
							/>
						</div>
					) : (
						<div className="w-full h-56 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
							<span className="text-gray-500">No Image</span>
						</div>
					)}
					<h3 className="text-xl font-bold text-gray-900 mb-2 truncate" title={product.name}>{product.name}</h3>
					<p className="text-lg font-semibold text-blue-600 mb-2">${product.price}</p>
					<p className="text-sm text-gray-700 mb-4 h-16 overflow-hidden flex-grow">{descriptionSnippet}</p>
				</div>
			</Link>
			<div className="mt-4">
				<AddToCartButton productId={product.id} />
			</div>
		</div>
	);
};

export default DetailedProductCard;
