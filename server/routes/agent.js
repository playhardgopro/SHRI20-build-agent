const { db } = require('../db');

function notifyAgent(req, res) {
  /**
   * Функция, которая проверяет наличие хоста и/или порта агента
   * @param {String} agentHost хост агента
   * @param {String} agentPort порт агента
   */
  function agentHostAndPortValidation(agentHost, agentPort) {
    if (!agentHost || !agentPort) {
      res.status(400).send('Host and port are required.');
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

function notifyBuildResult(req, res) {
  console.log(req.body);
  res.status(200);
  res.send('OK');

  console.log('/notify-build-result triggered');
}

module.exports = {
  notifyAgent,
  notifyBuildResult,
};
