'use client';

import Link from 'next/link';

export default function Breadcrumbs({ path }) {
	return (
		<nav aria-label="breadcrumb" className="mb-4 text-sm text-gray-500">
			<ol className="list-none p-0 inline-flex">
				{path.map((breadcrumb, index) => (
					<li key={breadcrumb.href} className="flex items-center">
						{index > 0 && <span className="mx-2">/</span>}
						{index === path.length - 1 ? (
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
