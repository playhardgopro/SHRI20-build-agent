const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const { port, host, serverHost, serverPort } = require('./agent-conf.json');

const envHost = process.env.HOST || host;

const envPort = process.env.PORT || port;

const envServerHost = process.env.SERVER_HOST || serverHost;

const envServerPort = process.env.SERVER_PORT || serverPort;

const DEFAULT_BUILDS_DIR = './builds';
const envBuildsDirectory = path.resolve(
  process.env.BUILDS_DIR || DEFAULT_BUILDS_DIR
);

module.exports = {
  host: envHost,
  port: envPort,
  serverHost: envServerHost,
  serverPort: envServerPort,
  buildsDir: envBuildsDirectory,
};
