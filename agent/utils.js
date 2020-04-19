const { exec } = require('child_process');
const { promisify } = require('util');
// const { mkdir } = require('fs').promises;

const execAsync = promisify(exec);

async function cloneRepo(buildsDir, repoName, commitHash, directory) {
  // NOTE: надо подумать как сделать лучше, сейчас падает, если папка уже создана
  // NOTE: нужна проверка на существование папки
  // await mkdir(buildsDir);

  const CLONE_COMMAND = `git clone https://github.com/${repoName}.git ${directory} && cd ${directory} && git reset --hard ${commitHash}`;
  const options = { cwd: buildsDir, env: { GIT_TERMINAL_PROMPT: '0' } };
  console.log('clone', CLONE_COMMAND);
  try {
    const { stdout, stderr } = await execAsync(CLONE_COMMAND, options);
    return { code: 0, stdout, stderr };
  } catch (e) {
    return {
      code: e.code,
      stdout: e.stdout,
      stderr: e.stderr ? e.stderr : e.toString(),
    };
  }
}

async function runBuild(buildDirectory, buildCommand) {
  const options = { cwd: buildDirectory };
  try {
    const { stdout, stderr } = await execAsync(buildCommand, options);
    return { code: 0, stdout, stderr };
  } catch (e) {
    return { code: e.code, stdout: e.stdout, stderr: e.stderr };
  }
}

module.exports = { cloneRepo, runBuild };
