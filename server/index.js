const express = require('express');
const axios = require('axios');
const https = require('https');
const cors = require('cors');

const { port, apiBaseUrl, apiToken } = require('./server-conf.json');

const { notifyAgent, notifyBuildResult } = require('./routes/agent');

axios.defaults.baseURL = apiBaseUrl;
axios.defaults.headers.common.Authorization = `Bearer ${apiToken}`;
axios.defaults.httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const app = express();

app.use(cors());
app.use(express.json());

// Ручки для агентов
app.post('/notify-agent', notifyAgent); // регистрация агента, в параметрах хост и порт, на котором запущен агент
app.post('/notify-build-result', notifyBuildResult);

app.listen(port, () => {
  console.info(`Server listening on http://localhost:${port}/`);
});
