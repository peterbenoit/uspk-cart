"use client";

import { useSearchParams } from 'next/navigation';
import FormField from '@/components/FormField';
import Button from '@/components/Button';

// Removed metadata export

export default function ContactPage() {
	const searchParams = useSearchParams();
	const isSuccess = searchParams?.get('success') === 'true';

	return (
		<div className="py-8 max-w-3xl mx-auto">
			<h1 className="text-2xl font-semibold mb-6 text-center">Contact Us</h1>
			<p className="text-gray-600 mb-8 text-center">Fill out the form below to get in touch with us.</p>

			{isSuccess && (
				<div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md">
					<p>Thank you! Your message has been sent successfully.</p>
				</div>
			)}

			<form method="POST" action="/api/contact" className="bg-white p-8 rounded-lg shadow-md space-y-6">
				<FormField
					label="Name"
					id="name"
					name="name"
					required
				/>
				<FormField
					label="Email"
					id="email"
					name="email"
					type="email"
					required
				/>
				<FormField
					label="Message"
					id="message"
					name="message"
					type="textarea"
					rows={5}
					required
				/>
				<Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
					Send Message
				</Button>
			</form>
		</div>
	);
}
