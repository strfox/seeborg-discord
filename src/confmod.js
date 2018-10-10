const jsyaml = require("js-yaml");
const logger = require("./logging").getLogger(module);
const fs = require("fs");

/**
 * Loads a configuration from disk.
 *
 * @param {string} filename Filename of the config
 * @returns {*} The configuration
 */
function loadConfig(filename) {
  const data = fs.readFileSync(filename);
  return jsyaml.load(data);
}

/**
 * Verifies and corrects a configuration object.
 *
 * If the configuration provided is found to be irregular, it will be altered and the
 * corrected data will be written to disk.
 *
 * @param {string} filename The filename of the config
 * @param {*} config The configuration object
 * @returns {void}
 */
function verifyAndCorrectConfig(filename, config) {
  let isConfigModified = false;
  if (!config.hasOwnProperty("voiceSettings")) {
    logger.warn("Your configuration file lacks the \"voiceChannels\" key." +
      " It will be added for you. If you wish to make the bot join a voice channel," +
      " please edit this setting.");
    config.voiceSettings = {};
    config.voiceSettings.useVoice = false;
    config.voiceSettings.acceptInvitesFrom = [];
    config.voiceSettings.responseFrequency = 50.0;
    config.voiceSettings.channels = {};
    config.voiceSettings.channels.whitelistEnabled = false;
    config.voiceSettings.channels.whitelist = [];
    config.voiceSettings.channels.blacklist = [];
    isConfigModified = true;
  }
  if (isConfigModified) {
    writeConfig(filename, config);
    logger.info("Modified configuration file saved.");
  }
}

/**
 * Returns true if the user with the provided authorId is ignored in the channel
 * with the given channelId in the provided configuration object.
 *
 * @param {*} config The configuration object
 * @param {string} authorId The ID of the message author
 * @param {string} channelId The ID of the channel where the message is in
 * @returns {boolean} True if the author is ignored
 */
function isIgnored(config, authorId, channelId) {
  return behavior(config, channelId, "ignoredUsers").includes(authorId);
}

/**
 * Returns true if the line matches a blacklisted pattern for the channel with
 * the given channelId in the provided configuration object.
 *
 * @param {*} config The configuration object
 * @param {string} channelId The ID of the channel
 * @param {string} line The line
 * @returns {boolean} True if matches a blacklist pattern
 */
function matchesBlacklistedPattern(config, channelId, line) {
  const patterns = behavior(config, channelId, "blacklistedPatterns");
  for (let pattern of patterns) {
    const regex = new RegExp(pattern, "mi");
    if (regex.test(line)) {
      logger.debug(`BLACKLISTED PATTERN [${pattern}] MATCHED [${line}]`);
      return true;
    }
  }
  return false;
}

/**
 * Returns true if the line matches a magic pattern for the channel with
 * the given channelId in the provided configuration object.
 *
 * @param {*} config The configuration object
 * @param {string} channelId The ID of the channel
 * @param {string} line The line
 * @returns {boolean} True if matches a magic pattern
 */
function matchesMagicPattern(config, channelId, line) {
  const patterns = behavior(config, channelId, "magicPatterns");
  for (let pattern of patterns) {
    const regex = new RegExp(pattern, "mi");
    if (regex.test(line)) {
      logger.debug(`MAGIC PATTERN [${pattern}] MATCHED [${line}]`);
      return true;
    }
  }
  return false;
}

/**
 * Returns the property for the given channel if it"s overridden;
 * otherwise, it returns the property from the default, root behavior.
 *
 * @param {*} config The configuration object
 * @param {string} channelId The channel id
 * @param {string} propertyName The name of the behavior property
 * @returns {*} The default behavior, unless there is an override
 */
function behavior(config, channelId, propertyName) {
  const defaultValue = config["behavior"][propertyName];
  const override = overrideForChannel(config, channelId);
  if (override === null || !override["behavior"].hasOwnProperty(propertyName)) {
    return defaultValue;
  } else {
    logger.debug(`Detected overridden behavior ${propertyName} of channel ${channelId}.`);
    return override["behavior"][propertyName];
  }
}

/**
 * Writes the provided configuration object to disk.
 *
 * @param {string} filename The file to write the configuration to
 * @param {*} config The configuration object to write
 * @returns {void}
 */
function writeConfig(filename, config) {
  fs.writeFileSync(filename, jsyaml.safeDump(config));
}

module.exports = {
  loadConfig: loadConfig,
  verifyAndCorrectConfig: verifyAndCorrectConfig,
  isIgnored: isIgnored,
  matchesBlacklistedPattern: matchesBlacklistedPattern,
  matchesMagicPattern: matchesMagicPattern,
  behavior: behavior
};

/**
 * Returns the channel override object for the channel with the given ID.
 *
 * @param {*} config The configuration object
 * @param {string} channelId The channel ID
 * @returns {*|null} The override, or null if there isn't one.
 */
function overrideForChannel(config, channelId) {
  for (let override of config["channelOverrides"]) {
    if (override["channelId"] === channelId) {
      return override;
    }
  }
  return null;
}