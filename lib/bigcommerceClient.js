import axios from 'axios';

const apiUrl = process.env.BIGCOMMERCE_API_URL;
console.log('[BigCommerce Client] Initializing with API URL:', apiUrl); // Added for debugging

const client = axios.create({
	baseURL: apiUrl,
	headers: {
		'X-Auth-Token': process.env.BIGCOMMERCE_API_TOKEN,
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
});

export default client;
