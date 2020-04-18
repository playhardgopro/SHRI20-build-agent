const express = require('express');
const axios = require('axios');
const https = require('https');
// const cors = require('cors');

const { port, host, serverHost, serverPort } = require('./agent-conf.json');

axios.defaults.httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const app = express();
// app.use(cors());
app.use(express.json());

async function registerOnServer(serverHost, serverPort) {
  try {
    // NOTE: допустим сервер и агент стартуют на одном адресе, поэтому host === serverHost
    await axios({
      url: `http://${serverHost}:${serverPort}/notify-agent`,
      method: 'post',
      data: { port, host },
    });
    console.info(
      `Successfully registered on the server, server url is ${serverHost}:${serverPort}`
    );
  } catch (e) {
    console.error('Error registering on the server', e);
    process.exit(1);
  }
}
app.listen(port, host, () => {
  // console.log(app);
  console.info(`Agent is listening on http://${host}:${port}/`);
  registerOnServer(serverHost, serverPort);
});
