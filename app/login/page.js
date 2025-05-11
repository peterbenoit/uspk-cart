'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const router = useRouter();

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// Using password-based auth (you can switch to OTP if preferred)
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw error;

			// Redirect to admin page on successful login
			router.push('/admin');
			router.refresh();
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
			<div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
				<div>
					<h1 className="text-2xl font-bold text-center">Admin Login</h1>
					{error && (
						<div className="bg-red-50 text-red-500 p-3 rounded mt-4">
							{error}
						</div>
					)}
				</div>

				<form className="space-y-6" onSubmit={handleLogin}>
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							id="email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
							placeholder="you@example.com"
						/>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							id="password"
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						{loading ? 'Logging in...' : 'Login'}
					</button>
				</form>
			</div>
		</div>
	);
}
