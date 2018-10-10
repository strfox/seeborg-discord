"use strict";

const logger = require("./logging").getLogger(module);
const confmod = require("./confmod");

class Learner {
  /**
   * Creates an instance of Learner.
   *
   * @param {*} bot The bot
   *
   * @prop {*} bot
   *
   * @memberof Learner
   */
  constructor(bot) {
    this.bot = bot;
  }

  /**
   * If the bot should learn the message, then the specified message will be learned.
   * Otherwise, it will be rejected.
   *
   * @param {*} message Message to be learned
   * @returns {boolean} True if the message was learned, false if it was rejected
   * @memberof Learner
   */
  apply(message) {
    if (this.shouldLearn(message)) {
      this.learn(message.cleanContent);
      return true;
    }
    return false;
  }

  /**
   * Returns true if the bot should learn the provided message.
   *
   * @param {*} message The message
   * @returns {boolean}
   * @memberof Learner
   */
  shouldLearn(message) {
    if (this.bot.isIgnored(message.author, message.channel)) {
      logger.debug("false: User is ignored");
      return false;
    }

    if (!confmod.behavior(this.bot.config, message.channel.id, "learning")) {
      logger.debug("false: learning=false in " + message.channel.id);
      return false;
    }

    // Ignore messages that match the blacklist
    if (confmod.matchesBlacklistedPattern(this.bot.config, message.channel.id, message.cleanContent)) {
      logger.debug(`false: Message contained blacklisted pattern: "${message}"`);
      return false;
    }

    return true;
  }

  /**
   * Learns a line.
   *
   * @param {string} line The line to learn
   * @returns {boolean} True if no errors occurred while learning.
   * @memberof Learner
   */
  learn(line) {
    try {
      this.bot.database.insertLine(line.toLowerCase());
    } catch (err) {
      logger.error(err);
      return false;
    }
    return true;
  }
}

module.exports = {
  Learner: Learner
};