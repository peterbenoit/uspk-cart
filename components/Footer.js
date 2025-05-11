// /Users/peterbenoit/GitHub/NextjsEcommerceTemplateGemini25/components/Footer.js
export default function Footer() {
	return (
		<footer className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-8 text-center">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<p>&copy; {new Date().getFullYear()} Gemini Store. All rights reserved.</p>
				<p className="mt-1 text-sm">
					Powered by Next.js and Tailwind CSS
				</p>
			</div>
		</footer>
	);
}
