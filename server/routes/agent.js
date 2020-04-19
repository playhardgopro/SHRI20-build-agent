function notifyAgent(req, res) {
  function registerAgent(agentHost, agentPort) {
    if (!agentHost || !agentPort) {
      res.status(400).send('Host and port are required.');
      return;
    }
    console.log('agent registered on', agentHost, ':', agentPort);
    res.status(200).send('OK');
  }
  // Регистрируем агента на сервере
  // const { host } = req.headers;
  const { port, host } = req.body;

  registerAgent(host, port);
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
