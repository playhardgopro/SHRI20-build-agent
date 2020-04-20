const express = require('express');
const axios = require('axios');
const https = require('https');
// const cors = require('cors');

const { port, host, serverHost, serverPort } = require('./env');
const { registerAgentOnServer } = require('./api/helpers');
const { postBuildHandler } = require('./api/build');

axios.defaults.httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const app = express();
// app.use(cors());
app.use(express.json());

app.post('/build', postBuildHandler);

app.get('/ping', (req, res) => res.status('204').end());

app.listen(port, host, () => {
  // console.log(app);
  console.info(`Agent is listening on http://${host}:${port}/`);
  registerAgentOnServer(serverHost, serverPort);
});
