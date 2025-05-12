'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
	const pathname = usePathname();
	const pathSegments = pathname.split('/').filter(segment => segment);

	const breadcrumbs = pathSegments.map((segment, index) => {
		const href = '/' + pathSegments.slice(0, index + 1).join('/');
		const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
		return { href, name };
	});

	return (
		<nav aria-label="breadcrumb" className="mb-4 text-sm text-gray-500">
			<ol className="list-none p-0 inline-flex">
				<li className="flex items-center">
					<Link href="/" className="hover:text-indigo-600">Home</Link>
				</li>
				{breadcrumbs.map((breadcrumb, index) => (
					<li key={breadcrumb.href} className="flex items-center">
						<span className="mx-2">/</span>
						{index === breadcrumbs.length - 1 ? (
							<span className="text-gray-700">{breadcrumb.name}</span>
						) : (
							<Link href={breadcrumb.href} className="hover:text-indigo-600">
								{breadcrumb.name}
							</Link>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}
