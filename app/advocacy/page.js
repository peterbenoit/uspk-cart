export const metadata = {
	title: 'USPK - Advocacy Index Page',
	description: 'Read about our advocacy efforts and initiatives.',
	keywords: 'USPK, advocacy, gear, optics, safety equipment',
	authors: [{ name: 'US Personal Kinetics', url: 'https://www.uspk.com' }],
	openGraph: {
		title: 'USPK - Advocacy Index Page',
		description: 'Read about our advocacy efforts and initiatives.',
		url: 'https://www.uspk.com/advocacy',
		type: 'website',
		images: [
			{
				url: 'https://www.uspk.com/images/og-image.jpg',
				width: 1200,
				height: 630,
				alt: 'USPK Advocacy Index Page',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'USPK - Advocacy Index Page',
		description: 'Read about our advocacy efforts and initiatives.',
		images: ['https://www.uspk.com/images/og-image.jpg'],
	},
};

import Breadcrumbs from '@/components/Breadcrumbs';

export default function AdvocacyIndexPage() {
	return (
		<>
			<Breadcrumbs path={[{ href: '/', name: 'Home' }, { href: '/advocacy', name: 'Advocacy' }]} />
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-4">Advocacy Index Page</h1>
				<p className="mb-4">This is a placeholder for the advocacy index page.</p>
			</div>
		</>
	);
}
