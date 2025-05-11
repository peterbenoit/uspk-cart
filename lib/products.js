// Product data and utility functions

// Mock product data
export const products = [
	{ id: '1', name: 'Tactical Backpack', category: 'gear' },
	{ id: '2', name: 'Rangefinder', category: 'optics' },
	{ id: '3', name: 'First Aid Kit', category: 'gear' },
	{ id: '4', name: 'Shooting Glasses', category: 'safety' },
];

/**
 * Get products filtered by category
 * @param {string} slug - Category slug to filter by
 * @returns {Array} Filtered products array
 */
export function getProductsByCategory(slug) {
	return products.filter(product => product.category === slug);
}
