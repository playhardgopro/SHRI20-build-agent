const express = require('express');
const axios = require('axios');
const https = require('https');
const cors = require('cors');
const { db } = require('./db');
const { errorHandler } = require('./helpers');

const { port, apiBaseUrl, apiToken } = require('./env');

const {
  notifyAgentHandler,
  notifyBuildResultHandler,
} = require('./routes/agent');

axios.defaults.baseURL = apiBaseUrl;
axios.defaults.headers.common.Authorization = `Bearer ${apiToken}`;
axios.defaults.httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const app = express();

app.use(cors());
app.use(express.json());

// Ручки для агентов
app.post('/notify-agent', notifyAgentHandler); // регистрация агента, в параметрах хост и порт, на котором запущен агент
app.post('/notify-build-result', notifyBuildResultHandler);

app.listen(port, () => {
  console.info(`Server listening on http://localhost:${port}/`);

  // NOTE: забираем настройки и кладем в базу данных
  axios
    .get(`${apiBaseUrl}/conf`)
    .then((response) => {
      if (response.data && response.status < 205) {
        db.set('settings', response.data.data).write();
      }
      return;
    })
    .catch((e) => errorHandler(e));

  require('./schedule');
});
