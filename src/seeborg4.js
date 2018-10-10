"use strict";
const assert = require("assert");

const confmod = require("./confmod");
const logger = require("./logging").getLogger(module);
const {
  PluginManager
} = require("./pluginman");
const {
  CommandHandler
} = require("./cmdhnd");
const {
  VoiceHandler
} = require("./voicehnd");
const {
  Learner
} = require("./learn");
const {
  Answerer
} = require("./answerer");

const instances = new Set();

/**
 * Destroys all SeeBorg4 instances.
 *
 * @returns {void}
 */
function cleanup() {
  for (let instance of instances) {
    instance.destroy();
  }
  assert(instances.size === 0);
}

class SeeBorg4 {
  /**
   * Creates an instance of SeeBorg4.
   *
   * @param {*} client The chat client to use
   * @param {*} config The configuration file to use
   * @param {*} database The database to use
   * @memberof SeeBorg4
   *
   * @prop {*} client
   * @prop {*} config
   * @prop {*} database
   *
   * @prop {PluginManager} pluginManager
   * @prop {CommandHandler} commandHandler
   * @prop {VoiceHandler} voiceHandler
   * @prop {Learner} learner
   * @prop {Answerer} answerer
   *
   * @prop {?Number} autoSaveJobId ID of the JavaScript timer running the autosave job
   */
  constructor(client, config, database) {
    instances.add(this);
    this.client = client;
    this.config = config;
    this.database = database;

    this.pluginManager = new PluginManager(this);
    this.commandHandler = new CommandHandler(this);
    this.voiceHandler = new VoiceHandler(this);
    this.learner = new Learner(this);
    this.answerer = new Answerer(this);

    this.autoSaveJobId = null;
  }

  start() {
    logger.info("SeeBorg4 is starting!");
    logger.info("Loading plugins.");
    this.pluginManager.loadPlugins();
    logger.info(`Loaded ${this.pluginManager.loadedPlugins.length} plugins.`);

    logger.info("Registering listeners.");
    this.registerListeners();

    logger.info("Starting auto save job.");
    this.startAutoSaveJob();

    logger.info("Logging in!");
    this.client.login(this.config.token)
      .catch(err => {
        logger.error("Failed to log in to Discord. " + err);
      });
  }

  /**
   * Destroys this instance and makes it unusable.
   * @returns {void}
   */
  destroy() {
    logger.info("Destroy: Shutting off plugins.");
    this.pluginManager.destroy();

    logger.info("Destroy: Shutting down the client.");
    this.client.destroy();

    logger.info("Destroy: Stopping auto save job.");
    clearInterval(this.autoSaveJobId);

    logger.info("Destroy: Saving before quitting.");
    this.database.save();

    logger.info("Destroy: Removing bot from list of instances.");
    assert(instances.delete(this));

    logger.info("Destroy: Done.");
  }

  registerListeners() {
    this.client.on("ready", this.onReady.bind(this));
    this.client.on("message", this.onMessage.bind(this));
  }

  startAutoSaveJob() {
    this.autoSaveJobId = setInterval(() => {
      logger.info("Saving dictionary...");
      this.database.save();
      logger.info("Saved!");
    }, this.config.autoSavePeriod * 1000);
  }

  onReady() {
    logger.info("Connected to Discord!");
  }

  onMessage(message) {
    logger.info(`Message in #${message.channel.name} (${message.channel.id}): ${message.author.username} (${message.author.id}) >>> ${message.content}`);

    const handled = this.commandHandler.handle(message);
    if (handled) {
      logger.debug("Message handled by command handler.");
      return;
    }
    this.answerer.apply(message);
    this.learner.apply(message);
  }

  /**
   * Returns true if the user is ignored in the given channel.
   *
   * @param {*} user The user
   * @param {*} channel The channel
   * @returns {boolean}
   * @memberof SeeBorg4
   */
  isIgnored(user, channel) {
    // Ignore own messages
    if (user.id === this.client.user.id) {
      return true;
    }

    // Ignore users in the ignore list
    if (confmod.isIgnored(this.config, user.id, channel.id)) {
      return true;
    }

    return false;
  }
}

module.exports = {
  instances: instances,
  cleanup: cleanup,
  SeeBorg4: SeeBorg4
};