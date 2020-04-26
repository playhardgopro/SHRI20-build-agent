const { exec, spawn } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
/**
 * Асинхронная функция, которая клонирует репозиторий с указанными параметрами
 * @param {string} buildsDir - путь до папки всех билдов
 * @param {string} repoName
 * @param {string} commitHash
 * @param {string} directory - путь до папки конкретного билда с уникальным ID
 *
 * @returns {Promise<{code:number, stdout: string, stderr: string, startTime: string}>}
 */
async function cloneRepo(buildsDir, repoName, commitHash, directory) {
  const CLONE_COMMAND = `git clone https://github.com/${repoName}.git ${directory} && cd ${directory} && git reset --hard ${commitHash}`;

  const startTime = new Date().toISOString();
  console.log(startTime, 'start time => git clone');

  const options = {
    cwd: buildsDir,
    encoding: '',
    env: { GIT_TERMINAL_PROMPT: '0', FORCE_COLOR: 3 },
  };
  console.log('clone', CLONE_COMMAND);
  try {
    const { stdout, stderr } = await execAsync(CLONE_COMMAND, options);
    return { code: 0, stdout, stderr, startTime };
  } catch (e) {
    return {
      code: e.code,
      stdout: e.stdout,
      stderr: e.stderr ? e.stderr : e.toString(),
      startTime: startTime,
    };
  }
}
/**
 * Асинхронная функция, которая запускает билд в указанной папке, указанной командой
 * @param {String} buildDirectory
 * @param {String} buildCommand
 *
 * @returns {Promise<{code:number, stdout: string, stderr: string, startTime: string}>}
 */
async function runBuild(buildDirectory, buildCommand) {
  const startTime = new Date().toISOString();

  const options = {
    cwd: buildDirectory,
    shell: true,
    stdio: 'pipe',
    env: { FORCE_COLOR: 3, ...process.env },
  };
  return new Promise((resolve) => {
    let log = '';

    const child = spawn(buildCommand, [], options);

    child.stderr.on('data', (data) => {
      log += data.toString();
    });
    child.stdout.on('data', (data) => {
      log += data.toString();
    });
    child.on('exit', (exitCode) => {
      if (exitCode === 0) {
        return resolve({ log, code: 0, startTime });
      }
      return resolve({ log, code: exitCode, startTime });
    });

    child.on('error', (code, signal) => {
      console.log(`child process killed code: ${code}, signal: ${signal}`);
    });
  }).then((resolve) => {
    execAsync(`rm -rf ${buildDirectory}`, options);
    return resolve;
  });
}

module.exports = { cloneRepo, runBuild };
