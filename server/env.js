const dotenv = require('dotenv');
dotenv.config();
const { port, apiBaseUrl, apiToken } = require('./server-conf.json');

const envPort = process.env.PORT || port;

const envApiBaseUrl = process.env.API_BASE_URL || apiBaseUrl;

const envApiToken = process.env.API_TOKEN || apiToken;

module.exports = {
  port: envPort,
  apiBaseUrl: envApiBaseUrl,
  apiToken: envApiToken,
};
