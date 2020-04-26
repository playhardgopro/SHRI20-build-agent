const { exec } = require('child_process');
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
    env: { GIT_TERMINAL_PROMPT: '0', FORCE_COLOR: true },
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
  const options = { cwd: buildDirectory, env: { FORCE_COLOR: true } };

  const startTime = new Date().toISOString();
  console.log(startTime, 'start time => run build');

  try {
    const { stdout, stderr } = await execAsync(buildCommand, options);
    return { code: 0, stdout, stderr, startTime };
  } catch (e) {
    return {
      code: e.code,
      stdout: e.stdout,
      stderr: e.stderr,
      startTime: startTime,
    };
  } finally {
    await execAsync(`rm -rf ${buildDirectory}`, options);
  }
}

module.exports = { cloneRepo, runBuild };
