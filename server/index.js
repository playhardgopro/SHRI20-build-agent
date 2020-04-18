const express = require('express');
const axios = require('axios');
const https = require('https');
const cors = require('cors');

const { port, apiBaseUrl, apiToken } = require('./server-conf.json');

// const { notifyAgent, notifyBuildResult } = require('./routes/agent');
const notifyAgent = (req, res) => {
  res.status(200);
  res.send('OK');

  console.log('/notify-agent triggered');
};
const notifyBuildResult = (req, res) => {
  res.status(200);
  res.send('OK');

  console.log('/notify-build-result triggered');
};

axios.defaults.baseURL = apiBaseUrl;
axios.defaults.headers.common.Authorization = `Bearer ${apiToken}`;
axios.defaults.httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const app = express();

app.use(cors());
app.use(express.json());

// Ручки для агентов
app.post('/notify-agent', notifyAgent);
app.post('/notify-build-result', notifyBuildResult);

app.listen(port, () => {
  console.info(`Server listening on http://localhost:${port}/`);
});
