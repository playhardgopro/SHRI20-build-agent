const { notifyBuildResult } = require('./helpers');
const { cloneRepo, runBuild } = require('../utils');
const { buildsDir } = require('../env');
const path = require('path');

/**
 * Асинхронная функция, которая проверяет необходимые поля в request,
 * клонит репозиторий, запускает билд и отправляет результаты серверу.
 *
 * @param {{body: {id:number, repoName: string, commitHash: string, buildCommand: string}}} req
 * @param {Object} res
 * @param {*} next
 *
 * @returns {Promise}
 */

async function postBuildHandler(req, res, next) {
  console.log(req.body);
  try {
    // /build -- запустить сборку. В параметрах -- id сборки, адрес репозитория, хэш коммита, команда, которую надо запустить
    const requiredFields = ['id', 'repoName', 'commitHash', 'buildCommand'];
    const absentField = requiredFields.find((field) => !req.body[field]);
    if (absentField) {
      res.status(400).send(`${absentField} is required`);
      return;
    }

    const { id, repoName, commitHash, buildCommand } = req.body;
    const dirNameForEveryBuild = `build-${id}`;

    res.status(204).send();
    console.log('response 204');

    const cloneResult = await cloneRepo(
      buildsDir,
      repoName,
      commitHash,
      dirNameForEveryBuild
    );
    if (cloneResult.code) {
      notifyBuildResult({ ...cloneResult, id });
      return;
    }
    console.log(cloneResult.code);

    const buildResult = await runBuild(
      path.resolve(buildsDir, dirNameForEveryBuild),
      buildCommand
    );
    notifyBuildResult({ ...buildResult, id });
  } catch (e) {
    next(e);
  }
}

module.exports = { postBuildHandler };
