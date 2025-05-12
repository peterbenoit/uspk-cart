import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link"; // Link import is not used here anymore, but Header uses it.
import "./globals.css";
import Header from "@/components/Header"; // Import the Header component
import Footer from "@/components/Footer"; // Import the Footer component

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: "USPK - US Personal Kinetics",
	description: "Gear, Optics, and Safety Equipment",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-800 flex flex-col min-h-screen`}
			>
				<Header /> {/* Use the Header component */}
				<main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
					{children}
				</main>
				<Footer /> {/* Use the Footer component */}
			</body>
		</html>
	);
}
