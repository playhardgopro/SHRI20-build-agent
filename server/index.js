const express = require('express');
const { port, apiBaseUrl, apiToken } = require('./server-conf.json');

const app = express();
app.use(express.json());

// Ручки для агентов
app.post('/notify-agent', notifyAgent);
app.post('/notify-build-result', notifyBuildResult);

app.listen(port, () => {
  console.info(`Server listening on http://localhost:${port}/`);
});
