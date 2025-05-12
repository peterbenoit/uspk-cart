export const metadata = {
	title: 'USPK - Category Index Page',
	description: 'Browse our categories of gear, optics, and safety equipment.',
	keywords: 'USPK, categories, gear, optics, safety equipment',
	authors: [{ name: 'US Personal Kinetics', url: 'https://www.uspk.com' }],
	openGraph: {
		title: 'USPK - Category Index Page',
		description: 'Browse our categories of gear, optics, and safety equipment.',
		url: 'https://www.uspk.com/category',
		type: 'website',
		images: [
			{
				url: 'https://www.uspk.com/images/og-image.jpg',
				width: 1200,
				height: 630,
				alt: 'USPK Category Index Page',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'USPK - Category Index Page',
		description: 'Browse our categories of gear, optics, and safety equipment.',
		images: ['https://www.uspk.com/images/og-image.jpg'],
	},
};

export default function CategoryIndexPage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-4">Category Index Page</h1>
			<p className="mb-4">This is a placeholder for the category index page.</p>
		</div>
	);
}
