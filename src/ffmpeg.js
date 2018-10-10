"use strict";
const path = require("path");
const exec = require("child_process").exec;
const commandExistsSync = require("command-exists").sync;
const fs = require("fs");

const logger = require("./logging").getLogger(module);

const SILENCE_PATH = path.posix.normalize(path.resolve(__dirname, "..", "resources", "silence.mp3"));

if (!fs.existsSync(SILENCE_PATH)) {
  throw new Error("ffmpeg module: Could not find file " + SILENCE_PATH);
}
logger.debug("SILENCE_PATH file exists, which is a good thing: " + SILENCE_PATH);

/**
 * @returns {boolean} true if ffmpeg is installed on this computer
 */
function isInstalled() {
  return commandExistsSync("ffmpeg");
}

/**
 * Concatenates file2 into file1.
 *
 * @param {string} file1 The path to the first file
 * @param {string} file2 The path to the second file
 * @returns {string} The result path
 * @async
 */
function concatenateTwoAudios(file1, file2) {
  return new Promise((resolve, reject) => {
    const s = `ffmpeg -y -i concat:"${path.posix.normalize(file1)}|${path.posix.normalize(file2)}" -codec copy ${file1}`;
    logger.debug("Running command: " + s);

    exec(s, (err, stdout, stderr) => {
      if (err) {
        reject(new Error("Could not run command: " + err));
      }
      logger.debug("ffmpeg stdout: " + stdout);
      logger.debug("ffmpeg stderr: " + stderr);
      resolve(file1);
    });
  });
}

/**
 * Concatenates silence into the specified file.
 *
 * @param {string} audioFile The path to the audio file to concatenate to
 * @returns {string} The path to the audio file
 * @async
 */
function addSilence(audioFile) {
  return this.concatenateTwoAudios(audioFile, SILENCE_PATH);
}

/**
 * Concatenates multiple audios into the first audio file of the array.
 *
 * @async
 * @param {Array<String>} files Paths
 * @returns {string} Path to the result file
 */
async function concatenateAudios(files) {
  if (files.length < 2) {
    throw new Error("need at least two files");
  }
  for (let i = 1; i < files.length; i++) {
    await this.concatenateTwoAudios(files[0], files[i]);
  }
  return files[0];
}

module.exports = {
  isInstalled: isInstalled,
  concatenateTwoAudios: concatenateTwoAudios,
  addSilence: addSilence,
  concatenateAudios: concatenateAudios
};