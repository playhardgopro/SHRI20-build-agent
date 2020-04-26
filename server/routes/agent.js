const { db } = require('../db');
const axios = require('axios');
const { apiBaseUrl } = require('../env');
const { errorHandler } = require('../helpers');
/**
 *  Функция, которая проверяет зарегистрирован ли агент в базе, если нет - то регистрирует
 * @param {{body:{host:string, port:string}}} req
 * @param {Object} res
 */
function notifyAgentHandler(req, res) {
  /**
   * Функция, которая проверяет наличие хоста и/или порта агента
   * @param {String} agentHost хост агента
   * @param {String} agentPort порт агента
   */
  function agentHostAndPortValidation(agentHost, agentPort) {
    if (!agentHost || !agentPort) {
      res.status(400).send('Host and port are required');
      return;
    }
  }

  const { host, port } = req.body;

  agentHostAndPortValidation(host, port);

  const agents = db.get('agents').value();

  if (agents.some((agent) => agent.host === host && agent.port === port)) {
    console.info(`Agent on http://${host}:${port} is already registered`);
    res.status(200).send('Agent is already registered');
    return;
  }

  agents.push({ host, port });
  db.write();

  console.info(`Agent registered on http://${host}:${port}`);
  res.status(204).end();
}

function notifyBuildResultHandler(req, res) {
  console.log('/notify-build-result triggered');
  // — сохранить результаты сборки. В параметрах — id сборки, статус, лог (stdout и stderr процесса).
  const { id, success, stdout, stderr, startTime } = req.body;
  if (!id) {
    res.status(400).send('Id is required');
    return;
  }

  const task = db.get('tasks').find({ id }).value();
  if (!task) {
    res.status(404).send(`No task with id: ${id}`);
    return;
  }

  axios
    .post(`${apiBaseUrl}/build/finish`, {
      buildId: id,
      duration: Date.now() - new Date(startTime),
      success,
      buildLog: '' + stdout + stderr,
    })
    .catch((e) => errorHandler(e));

  Object.assign(task, {
    id,
    success,
    stdout,
    stderr,
  });

  const agent = db
    .get('agents')
    .find((agent) => agent.taskId === id)
    .value();
  if (agent) {
    agent.taskId = null;
  }
  db.write();

  res.status(204).end();
}

module.exports = {
  notifyAgentHandler,
  notifyBuildResultHandler,
};
