import axios from 'axios';

const client = axios.create({
	baseURL: process.env.BIGCOMMERCE_API_URL,
	headers: {
		'X-Auth-Token': process.env.BIGCOMMERCE_API_TOKEN,
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
});

export default client;
