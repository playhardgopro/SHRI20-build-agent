const axios = require('axios');
const { apiBaseUrl } = require('./env');
const { db } = require('./db');

const CHECK_TIME = 10000;

async function runTaskOnAgent(task, agent) {
  const settings = db.get('settings').value();

  const { repoName, buildCommand } = settings;
  const { id, commitHash } = task;

  const sendTask = axios
    .post(`http://${agent.host}:${agent.port}/build`, {
      id,
      commitHash,
      repoName,
      buildCommand,
    })
    .catch((e) => console.log(e, 'sendTask err'));

  const startTask = axios
    .post(`${apiBaseUrl}/build/start`, {
      buildId: id,
      dateTime: new Date().toISOString(),
    })
    .then((resolve) =>
      console.log(resolve.status, 'start task', id, new Date().toISOString())
    )
    .catch((e) => console.log(e, 'startTask err'));
}

function removeBrokenAgent(agent) {
  // return task to the queue if present
  if (agent.taskId) {
    const task = db.get('tasks').find({ id: agent.taskId }).value();
    db.get('tasks').remove(task).value();
    db.get('queue').unshift(task).value();
  }

  db.get('agents').remove(agent).value();
  db.write();
}

async function drainQueue() {
  const queue = db.get('queue').value();
  const agents = db.get('agents').value();
  const tasks = db.get('tasks').value();

  if (!queue.length) return;
  if (!agents.length) return;

  const agent = agents.find((agent) => !agent.taskId);
  if (!agent) return;

  const task = queue.shift();
  // agent.taskId = task.id;
  // task.status = 'starting';
  // tasks.push(task);

  // db.write();

  try {
    await runTaskOnAgent(task, agent);
    // db.get('tasks')
    //   .find({ id: task.id })
    //   .set('status', 'started')
    //   .set('started', new Date().toISOString())
    //   .write();
    console.info(
      `Task ${task.id} started on agent ${agent.host}:${agent.port}`
    );
  } catch (e) {
    // remove broken agent and return task to the queue
    removeBrokenAgent(agent);

    console.error(
      `Task ${task.id} failed to start on agent ${agent.host}:${agent.port}. Return it to the queue.`,
      e
    );
  }
}

async function pingAgent(agent) {
  try {
    const res = await axios(`http://${agent.host}:${agent.port}/ping`);
    return res.ok;
  } catch (e) {
    return false;
  }
}

async function checkAgents() {
  // check only agents with tasks
  const agents = db
    .get('agents')
    .filter((agent) => agent.taskId)
    .value();

  try {
    if (agents.length) {
      console.info(`Checking ${agents.length} agent(s)`);
    }
    for (const agent of agents) {
      const isOk = await pingAgent(agent);
      if (!isOk) {
        console.error(
          `Agent ${agent.host}:${agent.port} is not responding. Removing it and returning task to the queue.`
        );
        removeBrokenAgent(agent);
      }
    }
  } finally {
    setTimeout(checkAgents, CHECK_TIME);
  }
}

async function getTasksFromServer() {
  const response = await axios.get(`${apiBaseUrl}/build/list`);
  const { data } = response.data;
  const waitingTasks = await data.filter((el) => el.status === 'Waiting');
  // const isInLocalDB = data.some((taskFromServer) =>
  //   queue.find((localTask) => taskFromServer.id == localTask.id)
  // );
  // if (!isInLocalDB) {
  db.set('tasks', data).write();
  db.set('queue', waitingTasks).write();
  // }
  // console.log(tasks, 'tasks');
}

setInterval(getTasksFromServer, 10000);
setInterval(drainQueue, 3000);
setTimeout(checkAgents, CHECK_TIME);
