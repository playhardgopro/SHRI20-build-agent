const axios = require('axios');
const { port, host, serverHost, serverPort } = require('../env');

const RETRY_TIME = 10000;

function errorHandler(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(
      '============================================================'
    );
    console.warn(error.response.status);
    console.log(error.response.data);
    console.error(
      '============================================================'
    );
    // console.log(error.response.headers)
  } else if (error.request) {
    const { protocol, path, method, hostname, port } = error.request._options;
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error(
      '============================================================'
    );
    console.error(
      'ERROR:',
      method,
      protocol + '//' + hostname + ':' + port + path,
      'did not answer'
    );
    console.error(
      '============================================================'
    );
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error(
      '============================================================'
    );
    console.log('Error', error.message);
    console.error(
      '============================================================'
    );
  }
}
/**
 * Асинхронная функция, которая отдает серверу результаты билда
 * @param {{code: number, stdout: string, stderr: string, id: number, startTime: string}} result
 * @returns {Promise}
 */
async function notifyBuildResult(result) {
  const options = {
    url: `http://${serverHost}:${serverPort}/notify-build-result`,
    method: 'post',
    data: {
      id: result.id,
      success: !result.code,
      log: result.log,
      startTime: result.startTime,
    },
  };
  try {
    await axios(options);
    console.log(options, 'options');

    console.info(`Successfully notified server, task id is ${result.id}`);
  } catch (e) {
    console.error(
      `Can not notify server! Will retry in ${RETRY_TIME}ms`,
      result
    );
    errorHandler(e);
    setTimeout(() => notifyBuildResult(result), RETRY_TIME);
  }
}

/**
 * Асинхронная функция, которая регистрирует агента на сервере
 * @param {String} serverHost
 * @param {String} serverPort
 * @returns {Promise}
 */

async function registerAgentOnServer(serverHost, serverPort) {
  try {
    await axios({
      url: `http://${serverHost}:${serverPort}/notify-agent`,
      method: 'post',
      data: { port, host },
    });
    console.info(
      `Successfully registered on server http://${serverHost}:${serverPort}`
    );
  } catch (e) {
    console.error('Error registering on the server');
    errorHandler(e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
}

module.exports = {
  registerAgentOnServer,
  notifyBuildResult,
  errorHandler,
};
