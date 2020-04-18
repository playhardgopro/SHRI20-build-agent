function notifyAgent(req, res) {
  function registerAgent(agentHost, agentPort) {
    if (!agentHost || !agentPort) {
      res.status(400).send('Host and port are required.');
      return;
    }
  }
  // Регистрируем агента на сервере
  const { host, port } = req.body;

  registerAgent(host, port);
  console.log('agent registered on', host, port);
}

function notifyBuildResult(req, res) {
  res.status(200);
  res.send('OK');

  console.log('/notify-build-result triggered');
}

module.exports = {
  notifyAgent,
  notifyBuildResult,
};
