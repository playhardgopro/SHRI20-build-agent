const dotenv = require('dotenv');
dotenv.config();
const { port, host, apiBaseUrl, apiToken } = require('./server-conf.json');

const envHost = process.env.HOST || host;

const envPort = process.env.PORT || port;

const envApiBaseUrl = process.env.API_BASE_URL || apiBaseUrl;

const envApiToken = process.env.API_TOKEN || apiToken;

module.exports = {
  host: envHost,
  port: envPort,
  apiBaseUrl: envApiBaseUrl,
  apiToken: envApiToken,
};
