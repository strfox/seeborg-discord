"use strict";
const tts = require("google-tts-api");
const fs = require("fs");
const md5 = require("md5");
const path = require("path");
const rimraf = require("rimraf");
const assert = require("assert");
const fetch = require("node-fetch");

const logger = require("./logging").getLogger(module);
const ffmpeg = require("./ffmpeg");

const TMPDIR = path.resolve(__dirname, "../", "tmp" + process.pid + "/");

/**
 * @returns {boolean} true if the temp directory exists
 */
function tempDirExists() {
  return fs.existsSync(TMPDIR);
}

/**
 * @returns {void}
 */
function createTempDir() {
  if (!tempDirExists()) {
    logger.info("Attempting to create temp directory: " + TMPDIR);
    fs.mkdirSync(TMPDIR);
    // Ensure the directory was created
    if (!tempDirExists()) {
      logger.error("Temp directory creation failed!");
    }
    logger.info("Created temp directory: " + TMPDIR);
  }
}

/**
 * @param {string} str The string to be synthesized
 * @returns {string} filename of the synthesized text audio
 * @throws {string} error
 * @async
 */
async function synthesize(str) {
  // Perform checks
  if (str.length === 0) {
    throw new Error("string cannot be empty");
  }
  if (!tempDirExists()) {
    createTempDir();
  }
  // Done performing checks
  const results = await _multiTTS(str);

  const urls = [];
  for (let result of results) {
    urls.push(await result.url);
  }

  const download = (url) => {
    return new Promise((resolve, reject) => {
      const filename = path.resolve(TMPDIR, md5(url) + ".mp3");

      if (fs.existsSync(filename)) {
        logger.debug("Already on disk, using cached version: " + filename);
        resolve(filename);
      }

      fetch(url).then(res => {
        const dest = fs.createWriteStream(filename);

        res.body.pipe(dest);
        dest.on("finish", () => resolve(filename));
        res.body.on("error", err => reject(err));
        dest.on("error", err => reject(err));
      });
    });
  };

  // Download all URLs
  const filenames = [];
  for (let url of urls) {
    filenames.push(await download(url));
  }
  assert(filenames.length > 0);

  // Add silence to the last file
  await ffmpeg.addSilence(filenames[filenames.length - 1]);

  return filenames;
}

/**
 * Cleans up the temp directory.
 *
 * @async
 * @returns {void}
 * @throws {string} error message
 */
function cleanup() {
  return new Promise((resolve, reject) => {
    logger.info(`Cleaning up temp directory ${TMPDIR}...`);
    rimraf(TMPDIR, err => {
      if (err) {
        reject(new Error("Could not remove the temp directory: " + err));
      }
      resolve();
    });
  });
}

/**
 * Split a TTS call for a long string into multiple TTS calls of smaller strings.
 *
 * @param {string} text Text to synthesize
 * @param {number} speed Speed of the voice
 * @param {number} timeout Timeout
 * @returns {Array.<MultiTTSResult>}
 */
function _multiTTS(text, speed, timeout) {
  const MAX = 200; // Max string length

  const isSpace = (s, i) => /\s/.test(s.charAt(i));
  const lastIndexOfSpace = (s, left, right) => {
    for (let i = right; i >= left; i--) {
      if (isSpace(s, i)) return i;
    }
    return -1; // not found
  };

  /**
   * @typedef MultiTTSResult
   * @prop {string} text
   * @prop {string} url
   */
  const result = [];
  const addResult = (text, start, end) => {
    const str = text.slice(start, end + 1);
    result.push({
      text: str,
      url: tts(str)
    });
  };

  let start = 0;
  for (;;) {
    // check text's length
    if (text.length - start <= MAX) {
      addResult(text, start, text.length - 1);
      break; // end of text
    }

    // check whether the word is cut in the middle.
    let end = start + MAX - 1;
    if (isSpace(text, end) || isSpace(text, end + 1)) {
      addResult(text, start, end);
      start = end + 1;
      continue;
    }

    // find last index of space
    end = lastIndexOfSpace(text, start, end);
    if (end === -1) {
      throw new Error("the amount of single word is over that 200.");
    }

    // add result
    addResult(text, start, end);
    start = end + 1;
  }

  return result;
}

module.exports = {
  createTempDir: createTempDir,
  synthesize: synthesize,
  cleanup: cleanup
};