"use client";

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	const fetchSession = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await fetch('/api/auth/session');
			if (response.ok) {
				const data = await response.json();
				setCurrentUser(data.user);
			} else {
				setCurrentUser(null);
			}
		} catch (error) {
			console.error("Failed to fetch session:", error);
			setCurrentUser(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchSession();
	}, [fetchSession]);

	const login = async (email, password) => {
		setIsLoading(true);
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});
			const data = await response.json();
			if (response.ok) {
				setCurrentUser(data.user || { email, customerId: data.customerId }); // Adjust based on actual login response
				await fetchSession(); // Re-fetch session to get latest state from cookie
				router.push('/account'); // Or wherever you want to redirect after login
				return { success: true, data };
			} else {
				throw new Error(data.message || 'Login failed');
			}
		} catch (error) {
			console.error("Login error:", error);
			setCurrentUser(null);
			return { success: false, error: error.message };
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		setIsLoading(true);
		try {
			const response = await fetch('/api/auth/logout', { method: 'POST' });
			if (response.ok) {
				setCurrentUser(null);
				router.push('/login');
				// Optionally, clear any client-side cart associated with the logged-out user
				// if it shouldn't persist for a guest or next login.
			} else {
				const data = await response.json();
				throw new Error(data.message || 'Logout failed');
			}
		} catch (error) {
			console.error("Logout error:", error);
			// Decide if UI should show an error or just fail silently
		} finally {
			setIsLoading(false);
		}
	};

	const value = {
		currentUser,
		isAuthenticated: !!currentUser,
		isLoading,
		login,
		logout,
		fetchSession, // Expose fetchSession if manual refresh is needed elsewhere
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
