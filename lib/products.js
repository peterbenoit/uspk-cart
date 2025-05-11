// Product data and utility functions

import { supabase } from '@/lib/supabaseClient';

/**
 * Get all products from the database
 * @returns {Promise<Array>} Products array
 */
export async function getAllProducts() {
	const { data: products, error } = await supabase
		.from('products')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching products:', error);
		return [];
	}

	return products;
}

/**
 * Get products filtered by category
 * @param {string} slug - Category slug to filter by
 * @returns {Promise<Array>} Filtered products array
 */
export async function getProductsByCategory(slug) {
	const { data: products, error } = await supabase
		.from('products')
		.select('*')
		.eq('category', slug);

	if (error) {
		console.error('Error fetching products by category:', error);
		return [];
	}

	return products;
}

/**
 * Get a single product by its ID
 * @param {string} id - Product ID to find
 * @returns {Promise<Object|null>} Product object or null if not found
 */
export async function getProductById(id) {
	const { data: product, error } = await supabase
		.from('products')
		.select('*')
		.eq('id', id)
		.single();

	if (error) {
		console.error('Error fetching product by id:', error);
		return null;
	}

	return product;
}

/**
 * Update a product in the database
 * @param {number} id - Product ID to update
 * @param {Object} updates - Object containing fields to update
 * @returns {Promise<Object|null>} Updated product or null on error
 */
export async function updateProduct(id, updates) {
	const { data: product, error } = await supabase
		.from('products')
		.update(updates)
		.eq('id', id)
		.select('*')
		.single();

	if (error) {
		console.error('Error updating product:', error);
		return null;
	}

	return product;
}

/**
 * Create a new product in the database
 * @param {Object} data - Product data object
 * @returns {Promise<Object|null>} Created product or null on error
 */
export async function createProduct(data) {
	const { data: product, error } = await supabase.rpc('create_product', {
		pname: data.name,
		pcategory: data.category,
		pdescription: data.description,
		pprice: data.price,
		pimage_url: data.image_url,
		pstock: data.stock,
	});

	if (error) {
		console.error('Error creating product:', error);
		return null;
	}

	return product;
}
