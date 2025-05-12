// Product data and utility functions

import { supabase } from '@/lib/supabaseClient';

/**
 * Get all products from the database
 * @returns {Promise<Array>} Products array
 */
export async function getAllProducts() {
	const { data: products, error } = await supabase.rpc('get_all_products');

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
	const { data: products, error } = await supabase.rpc('get_products_by_category', { cat: slug });

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
	const { data: product, error } = await supabase.rpc('get_product_by_id', { pid: id });

	if (error) {
		console.error('Error fetching product by id:', error);
		return null;
	}

	return product;
}

/**
 * Update a product in the database
 * @param {number} id - Product ID to update
 * @param {Object} updates - Object containing fields to update (name, category, description, price, image_url, stock)
 * @returns {Promise<Object|null>} Updated product or null on error
 */
export async function updateProduct(id, updates) {
	const { data, error } = await supabase.rpc('update_product', {
		pid: id,
		pname: updates.name,
		pcategory: updates.category,
		pdescription: updates.description,
		pprice: updates.price,
		pimage_url: updates.image_url,
		pstock: updates.stock,
	});

	if (error) {
		console.error('Error updating product:', error);
		return null;
	}

	// The RPC function 'update_product' returns SETOF products,
	// so data will be an array. We expect a single updated product.
	return data && data.length > 0 ? data[0] : null;
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
