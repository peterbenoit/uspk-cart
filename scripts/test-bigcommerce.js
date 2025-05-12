// scripts/test-bigcommerce.js
require('dotenv').config({ path: '.env.local' });
const https = require('https');

const { BIGCOMMERCE_API_URL, BIGCOMMERCE_API_TOKEN } = process.env;

const options = {
	method: 'GET',
	headers: {
		'X-Auth-Token': BIGCOMMERCE_API_TOKEN,
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
};

https.get(`${BIGCOMMERCE_API_URL}catalog/products`, options, res => {
	let data = '';
	res.on('data', chunk => data += chunk);
	res.on('end', () => {
		try {
			const parsed = JSON.parse(data);
			console.log('✅ BigCommerce Products:', parsed);
		} catch (e) {
			console.error('❌ Response error:', data);
		}
	});
}).on('error', err => {
	console.error('❌ Request failed:', err.message);
});
