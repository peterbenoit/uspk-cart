'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import FormField from '@/components/FormField'; // Added import
import Button from '@/components/Button'; // Added import

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(true); // Start with loading
	const [error, setError] = useState(null);
	const router = useRouter();

	// Check if user is already logged in
	useEffect(() => {
		async function checkSession() {
			const { data: { session } } = await supabase.auth.getSession();

			console.log('Session: ' + JSON.stringify(session));

			if (session) {
				// User is already logged in, redirect to admin
				router.replace('/admin');
			} else {
				// Not logged in, show the login form
				setLoading(false);
			}
		}

		checkSession();
	}, [router]);

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
			router.replace('/admin');
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-[50vh]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
			</div>
		);
	}

	return (
		<div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
			<div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
				<div>
					<h1 className="text-2xl font-semibold text-center">Admin Login</h1>
					{error && (
						<div className="bg-red-100 text-red-600 p-3 rounded-md mt-4 text-sm">
							{error}
						</div>
					)}
				</div>

				<form className="space-y-6" onSubmit={handleLogin}>
					<FormField
						label="Email"
						id="email"
						type="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="you@example.com"
					/>
					<FormField
						label="Password"
						id="password"
						type="password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="••••••••"
					/>
					<div>
						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? 'Logging in...' : 'Login'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
