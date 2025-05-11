import Link from "next/link";

export default function Header() {
	return (
		<header className="bg-white p-4 shadow-md border-b border-gray-200">
			<nav className="container mx-auto flex justify-between items-center">
				<Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
					Gemini
				</Link>
				<div className="flex gap-6">
					<Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</Link>
					<Link href="/category/gear" className="text-gray-700 hover:text-blue-600 transition-colors">Gear</Link>
					<Link href="/category/optics" className="text-gray-700 hover:text-blue-600 transition-colors">Optics</Link>
					<Link href="/category/safety" className="text-gray-700 hover:text-blue-600 transition-colors">Safety</Link>
					<Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">Admin</Link>
				</div>
			</nav>
		</header>
	);
}
