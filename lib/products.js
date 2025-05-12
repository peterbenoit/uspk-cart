// Product data and utility functions

import { supabase } from '@/lib/supabaseClient';

/**
 * Get all products from the database
 * @returns {Promise<Array>} Products array
 * @deprecated Use getAllProducts instead
 */
export async function getAllProductsSupabase() {
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
 * @deprecated Use getProductsByCategory instead
 */
export async function getProductsByCategorySupabase(slug) {
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
 * @deprecated: Use getProductById instead
 */
export async function getProductByIdSupabase(id) {
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
export async function updateProductSupabase(id, updates) {
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
export async function createProductSupabase(data) {
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

import bigcommerceClient from './bigcommerceClient';

export async function getAllProducts() {
	try {
		const response = await bigcommerceClient.get('/catalog/products', {
			params: { include: 'images' }
		});
		return response.data.data || [];
	} catch (error) {
		console.error('Error fetching products from BigCommerce:', error);
		return [];
	}
}

export async function getProductById(id) {
	try {
		const response = await bigcommerceClient.get(`/catalog/products/${id}`);
		return response.data.data || null;
	} catch (error) {
		console.error('Error fetching product by ID from BigCommerce:', error);
		return null;
	}
}

async function getCategoryMap() {
	try {
		const res = await bigcommerceClient.get('/catalog/categories');
		const categories = res.data.data || [];
		const map = {};
		for (const c of categories) {
			map[c.id] = c.name.toLowerCase();
		}
		return map;
	} catch (error) {
		console.error('Failed to fetch categories for mapping:', error);
		return {};
	}
}

export async function getProductsByCategory(slug) {
	try {
		const categoryMap = await getCategoryMap();
		const categoryId = Object.entries(categoryMap).find(
			([, name]) => name === slug.toLowerCase()
		)?.[0];

		if (!categoryId) {
			console.warn(`Category not found for slug: ${slug}`);
			return [];
		}

		const productsResponse = await bigcommerceClient.get('/catalog/products', {
			params: {
				'categories:in': categoryId
			}
		});

		return productsResponse.data.data || [];
	} catch (error) {
		console.error('Error fetching products by category from BigCommerce:', error);
		return [];
	}
}
