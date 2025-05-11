export default function ContactPage({ searchParams }) {
	const isSuccess = searchParams?.success === 'true';

	return (
		<div className="py-8">
			<h1 className="text-3xl font-bold mb-6">Contact Us</h1>
			<p className="text-gray-600 mb-8">Fill out the form below to get in touch with us.</p>

			{isSuccess && (
				<div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
					<p>Thank you! Your message has been sent successfully.</p>
				</div>
			)}

			<form method="POST" action="/api/contact" className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
				<div className="mb-4">
					<label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
					<input
						type="text"
						id="name"
						name="name"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div className="mb-4">
					<label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div className="mb-6">
					<label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
					<textarea
						id="message"
						name="message"
						rows="5"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					></textarea>
				</div>

				<button
					type="submit"
					className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
				>
					Send Message
				</button>
			</form>
		</div>
	);
}
