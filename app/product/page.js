export const metadata = {
	title: 'USPK - Product Index Page',
	description: 'Browse our products of gear, optics, and safety equipment.',
	keywords: 'USPK, products, gear, optics, safety equipment',
	authors: [{ name: 'US Personal Kinetics', url: 'https://www.uspk.com' }],
	openGraph: {
		title: 'USPK - Product Index Page',
		description: 'Browse our products of gear, optics, and safety equipment.',
		url: 'https://www.uspk.com/product',
		type: 'website',
		images: [
			{
				url: 'https://www.uspk.com/images/og-image.jpg',
				width: 1200,
				height: 630,
				alt: 'USPK Product Index Page',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'USPK - Product Index Page',
		description: 'Browse our products of gear, optics, and safety equipment.',
		images: ['https://www.uspk.com/images/og-image.jpg'],
	},
};

import Breadcrumbs from '@/components/Breadcrumbs';

export default function ProductIndexPage() {
	return (
		<>
			<Breadcrumbs path={[{ href: '/', name: 'Home' }, { href: '/product', name: 'Products' }]} />
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-4">Product Listing Page</h1>
				<p className="mb-4">This is a placeholder for the product index page.</p>
			</div>
		</>
	);
}
