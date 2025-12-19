const axios = require('axios');

const djangoApi = axios.create({
  baseURL: process.env.API_URL,
  timeout: 30000,
  headers: {
    'X-API-KEY': process.env.API_TOKEN,
  },
});

module.exports = djangoApi;
