"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Search, Cart3, ChevronDown } from 'react-bootstrap-icons';
import { useCart } from "@/context/CartContext"; // Import useCart

export default function Header() {
	const [isShopOpen, setIsShopOpen] = useState(false);
	const shopRef = useRef(null);
	const { getCartTotalItems } = useCart(); // Get cart total items
	const totalItems = getCartTotalItems();

	const toggleShopDropdown = () => {
		setIsShopOpen(!isShopOpen);
	};

	useEffect(() => {
		function handleClickOutside(event) {
			if (shopRef.current && !shopRef.current.contains(event.target)) {
				setIsShopOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [shopRef]);

	const navLinkClasses = "text-gray-700 hover:text-indigo-600 transition-colors px-3 py-2 rounded-md text-sm font-medium";
	const dropdownLinkClasses = "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-md";

	return (
		<header className="bg-white p-4 shadow-md border-b border-gray-200 sticky top-0 z-50">
			<div className="container mx-auto flex justify-between items-center">
				{/* Logo */}
				<div className="flex items-center">
					{/* Ideal: <img src="/path/to/your/logo.svg" alt="USPK GUNS Logo" className="h-10" /> */}
					{/* Text-based fallback for logo */}
					<Link href="/" className="flex items-end">
						<div className="flex items-center">
							{/* Simplified target icon representation */}
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-bullseye mr-1 text-gray-700" viewBox="0 0 16 16">
								<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
								<path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10zm0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
								<path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
								<path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
							</svg>
							<span className="text-2xl font-extrabold text-gray-800">USPK</span>
							<span className="text-xl font-semibold text-gray-700 ml-1">GUNS</span>
						</div>
					</Link>
					<span className="ml-3 text-xs text-gray-500 self-end pb-0.5">Your Trusted Source</span>
				</div>

				{/* Navigation Links */}
				<nav className="hidden md:flex items-center space-x-1">
					<Link href="/" className={navLinkClasses} aria-label="Home">Home</Link>

					{/* Shop Dropdown */}
					<div className="relative" ref={shopRef}>
						<button
							onClick={toggleShopDropdown}
							className={`${navLinkClasses} flex items-center`}
							aria-expanded={isShopOpen}
							aria-haspopup="true"
							aria-label="Shop products"
						>
							Shop
							<ChevronDown size={16} className={`ml-1 transition-transform duration-200 ${isShopOpen ? 'rotate-180' : ''}`} />
						</button>
						{isShopOpen && (
							<div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-max max-w-4xl bg-white shadow-xl rounded-lg border border-gray-200 z-50">
								<div className="p-6 flex gap-6">
									{/* Categories Columns */}
									<div className="flex-grow grid grid-cols-2 gap-x-8 gap-y-4">
										<div>
											<h3 className="text-sm font-semibold text-gray-800 tracking-wide">FIREARMS & NFA</h3>
											<div className="w-12 h-0.5 bg-gray-300 my-2"></div>
											<ul className="space-y-1">
												<li><Link href="/category/handguns" className={dropdownLinkClasses}>Handguns</Link></li>
												<li><Link href="/category/rifles" className={dropdownLinkClasses}>Rifles</Link></li>
												<li><Link href="/category/shotguns" className={dropdownLinkClasses}>Shotguns</Link></li>
												<li><Link href="/category/suppressors" className={dropdownLinkClasses}>Suppressors</Link></li>
											</ul>
										</div>
										<div>
											<h3 className="text-sm font-semibold text-gray-800 tracking-wide">PARTS & ACCESSORIES</h3>
											<div className="w-12 h-0.5 bg-gray-300 my-2"></div>
											<ul className="space-y-1">
												<li><Link href="/category/magazines" className={dropdownLinkClasses}>Magazines</Link></li>
												<li><Link href="/category/optics" className={dropdownLinkClasses}>Optics</Link></li>
												<li><Link href="/category/lights" className={dropdownLinkClasses}>Lights</Link></li>
												<li><Link href="/category/parts" className={dropdownLinkClasses}>Parts</Link></li>
												<li><Link href="/category/other-accessories" className={dropdownLinkClasses}>Other Accessories</Link></li>
											</ul>
										</div>
										{/* View All Products Button - Spanning two columns */}
										<div className="col-span-2 mt-4">
											<Link href="/product" className="block w-full text-center px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors text-sm font-medium">
												View All Products
											</Link>
										</div>
									</div>

									{/* Featured Items Column */}
									<div className="w-64 flex-shrink-0 bg-gray-800 rounded-md p-5 text-white flex flex-col justify-between" style={{ backgroundImage: "url('/placeholder-gun-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
										{/* Placeholder for actual image, using a dark bg as fallback */}
										<div className="bg-black bg-opacity-50 p-4 rounded-md h-full flex flex-col">
											<h3 className="text-lg font-semibold mb-2">FEATURED ITEMS</h3>
											<p className="text-sm mb-4 flex-grow">Check out featured sales & specials.</p>
											<Link href="/featured" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
												Shop Now
											</Link>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
					<Link href="/advocacy" className={navLinkClasses} aria-label="Advocacy">Advocacy</Link>
					<Link href="/contact" className={navLinkClasses} aria-label="Contact Us">Contact</Link>
				</nav>

				{/* Icons */}
				<div className="flex items-center space-x-4">
					<button className="text-gray-600 hover:text-indigo-600 transition-colors" aria-label="Search">
						<Search size={22} />
					</button>
					<button className="relative text-gray-600 hover:text-indigo-600 transition-colors" aria-label="View Cart">
						<Cart3 size={24} />
						{totalItems > 0 && (
							<span className="absolute -top-2 -right-2.5 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
								{totalItems}
							</span>
						)}
					</button>
					{/* Mobile Menu Button - can be added here if needed */}
				</div>
			</div>
		</header>
	);
}
