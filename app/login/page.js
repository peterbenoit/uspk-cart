'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/FormField';
import Button from '@/components/Button';
import Link from 'next/link'; // Added for navigation

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false); // Changed initial state to false, true was for initial session check
	const [error, setError] = useState(null);
	const router = useRouter();

	// Placeholder for checking if user is already logged in
	// This will be more robust once session management is fully in place
	useEffect(() => {
		// Example: Check for a session token (implementation detail for later)
		// const sessionToken = localStorage.getItem('sessionToken');
		// if (sessionToken) {
		//   router.push('/account'); // Redirect to account page if logged in
		// }
		// For now, just ensure loading is false if no initial check is performed.
		// If there was an initial check, it would set isLoading to false.
		// Since we are not doing an initial check yet, we can remove the initial true state for isLoading.
	}, [router]);

	const handleLogin = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Login failed');
			}

			// Assuming the API returns a success message or user data
			// And sets a session cookie httpOnly

			// Redirect to account page or home page after successful login
			router.push('/account'); // Or '/' or a dedicated dashboard

		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
			<div className="max-w-md mx-auto">
				<h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
					Login to Your Account
				</h1>
				<form onSubmit={handleLogin} className="space-y-6">
					<FormField
						label="Email Address"
						type="email"
						id="email"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						placeholder="you@example.com"
					/>
					<FormField
						label="Password"
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						placeholder="••••••••"
					/>
					{error && (
						<p className="text-sm text-red-600" role="alert">
							{error}
						</p>
					)}
					<div>
						<Button type="submit" disabled={isLoading} fullWidth>
							{isLoading ? 'Logging in...' : 'Login'}
						</Button>
					</div>
				</form>
				<p className="mt-6 text-center text-sm text-gray-600">
					Don&apos;t have an account?{' '}
					<Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}
