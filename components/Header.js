import Link from "next/link";

export default function Header() {
	return (
		<header className="bg-white p-4 shadow-md border-b border-gray-200 sticky top-0 z-50">
			<nav className="container mx-auto flex justify-between items-center">
				<Link href="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors" aria-label="Gemini Home">
					Gemini
				</Link>
				<div className="flex gap-3 sm:gap-6">
					<Link href="/contact" className="text-gray-700 hover:text-indigo-600 transition-colors px-2 py-1 rounded-md hover:bg-indigo-50" aria-label="Contact Us">Contact</Link>
					<Link href="/category/gear" className="text-gray-700 hover:text-indigo-600 transition-colors px-2 py-1 rounded-md hover:bg-indigo-50" aria-label="Gear Category">Gear</Link>
					<Link href="/category/optics" className="text-gray-700 hover:text-indigo-600 transition-colors px-2 py-1 rounded-md hover:bg-indigo-50" aria-label="Optics Category">Optics</Link>
					<Link href="/category/safety" className="text-gray-700 hover:text-indigo-600 transition-colors px-2 py-1 rounded-md hover:bg-indigo-50" aria-label="Safety Category">Safety</Link>
					<Link href="/admin" className="text-gray-700 hover:text-indigo-600 transition-colors px-2 py-1 rounded-md hover:bg-indigo-50" aria-label="Admin Panel">Admin</Link>
				</div>
			</nav>
		</header>
	);
}
