// Product data and utility functions

// Mock product data
export const products = [
	{ id: '1', name: 'Tactical Backpack', category: 'gear', description: 'Durable backpack designed for outdoor tactical use.' },
	{ id: '2', name: 'Rangefinder', category: 'optics', description: 'Precision optical device for measuring distance to target.' },
	{ id: '3', name: 'First Aid Kit', category: 'gear', description: 'Comprehensive medical supplies for emergency situations.' },
	{ id: '4', name: 'Shooting Glasses', category: 'safety', description: 'Impact-resistant eyewear for shooting sports and range use.' },
];

/**
 * Get products filtered by category
 * @param {string} slug - Category slug to filter by
 * @returns {Array} Filtered products array
 */
export function getProductsByCategory(slug) {
	return products.filter(product => product.category === slug);
}

/**
 * Get a single product by its ID
 * @param {string} id - Product ID to find
 * @returns {Object|undefined} Product object or undefined if not found
 */
export function getProductById(id) {
	return products.find((product) => product.id === id);
}
