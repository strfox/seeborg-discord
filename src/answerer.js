"use strict";
const assert = require("assert");
const _ = require("underscore");

const logging = require("./logging");
const logger = logging.getLogger(module);
const confmod = require("./confmod");
const stringUtil = require("./stringutil");

/**
 * This class is responsible for the flow of response construction.
 *
 * @class Answerer
 */
class Answerer {
  /**
   * Creates an instance of Answerer.
   *
   * @param {*} bot The bot
   *
   * @prop {*} bot
   *
   * @memberof Answerer
   */
  constructor(bot) {
    this.bot = bot;
  }

  /**
   * If the bot should reply to the message, then the specified message will be replied to.
   * Otherwise, nothing will be done.
   *
   * @param {*} message the message
   * @returns {boolean} True if the message was replied to
   * @memberof Answerer
   */
  apply(message) {
    if (this.shouldComputeAnswer(message)) {
      this.replyWithAnswer(message);
      return true;
    }
    return false;
  }

  /**
   * Return true if the bot should build a reply to the message.
   *
   * @param {*} message The message
   * @returns {boolean}
   * @memberof SeeBorg4
   */
  shouldComputeAnswer(message) {
    if (this.bot.isIgnored(message.author, message.channel)) {
      logger.debug("false: User is ignored");
      return false;
    }

    // Bot should not speak if speaking is set to false
    if (!confmod.behavior(this.bot.config, message.channel.id, "speaking")) {
      logger.debug("false: speaking=false in " + message.channel.name);
      return false;
    }

    // Bot should not speak if they don't have permission
    if (message.guild !== null && message.guild !== undefined) {
      if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) {
        logger.debug("false: No permission to send messages in " + message.channel.name);
        return false;
      }
    }

    // Utility function
    function chancePredicate(chancePercentage, predicate) {
      const randInt = Math.random() * 99; // Generate a random number between 0 and 99
      logger.debug(`ChancePercentage: ${chancePercentage}, Rolled: ${randInt}`);
      if (chancePercentage > 0 && predicate()) {
        if (chancePercentage > randInt || chancePercentage === 100) {
          return true;
        }
      }
      return false;
    }

    // Reply mention
    const replyMention = confmod.behavior(this.bot.config, message.channel.id, "replyMention");
    assert(replyMention);
    logger.debug("Rolling for ReplyMention");
    if (chancePredicate(replyMention, () => message.isMentioned(this.bot.client.user))) {
      logger.debug("Replying because of ReplyMention in channel " + message.channel.name);
      return true;
    }

    // Reply magic
    const replyMagic = confmod.behavior(this.bot.config, message.channel.id, "replyMagic");
    assert(replyMagic);
    logger.debug("Rolling for ReplyMagic");
    if (chancePredicate(replyMagic, () => confmod.matchesMagicPattern(this.bot.config, message.channel.id, message.cleanContent))) {
      logger.debug("Replying because of ReplyMagic in channel " + message.channel.name);
      return true;
    }

    // Reply rate
    const replyRate = confmod.behavior(this.bot.config, message.channel.id, "replyRate");
    assert(replyRate);
    logger.debug("Rolling for ReplyRate");
    if (chancePredicate(replyRate, () => true)) {
      logger.debug("Replying because of ReplyRate in channel " + message.channel.name);
      return true
    }

    logger.debug("Reply fail");
    return false;
  }

  /**
   * Sends an answer to the channel the message was sent in.
   *
   * @param {*} message The message
   * @returns {void}
   * @memberof Answerer
   */
  replyWithAnswer(message) {
    const response = this.computeAnswer(message.cleanContent);

    if (response === null) {
      logger.debug("ComputeAnswer returned empty answer.");
    } else {
      message.channel.send(response).catch((err) => {
        logger.error(err);
      });
    }
  }

  /**
   * Builds an answer to a line.
   *
   * @param {string} toLine Line to build an answer to
   * @returns {string} The answer
   * @memberof Answerer
   */
  computeAnswer(toLine) {
    const lowercaseLine = toLine.toLowerCase();
    const words = stringUtil.splitWords(lowercaseLine);
    const knownWords = words.filter((word) => this.bot.database.isWordKnown(word));

    if (knownWords.length === 0) {
      logger.debug("No sentences with " + words + " found");
      return null;
    }

    const pivot = _.sample(knownWords);
    const sentences = this.bot.database.sentencesWithWord(pivot);

    if (sentences.length === 0) {
      return null;
    }
    if (sentences.length === 1) {
      return sentences[0];
    }

    const leftSentence = _.sample(sentences);
    const rightSentence = _.sample(sentences);

    const leftSentenceWords = stringUtil.splitWords(leftSentence);
    const rightSentenceWords = stringUtil.splitWords(rightSentence);

    const leftSide = leftSentenceWords.slice(0, leftSentenceWords.indexOf(pivot));
    const rightSide = rightSentenceWords.slice(rightSentenceWords.indexOf(pivot) + 1, rightSentenceWords.length);

    return [leftSide.join(" "), pivot, rightSide.join(" ")].join(" ");
  }
}

module.exports = {
  Answerer: Answerer
};