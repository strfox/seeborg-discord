"use strict";
const assert = require("assert");

const logger = require("./logging").getLogger(module);
const {
  findMemberVoiceChannel
} = require("./discordutil");

class CommandHandler {
  /**
   * Creates an instance of CommandHandler.
   *
   * @param {*} bot The bot
   * @memberof CommandHandler
   *
   * @prop {*} bot
   * @prop {string} commandPrefix
   */
  constructor(bot) {
    this.bot = bot;
    this.commandPrefix = "/";
  }

  /**
   * Takes in a message and handles it.
   * If the message was handled, this function will return true.
   *
   * @param {*} message Message to take
   * @returns {boolean} Whether the message was handled
   * @memberof CommandHandler
   */
  handle(message) {
    if (!this.shouldHandleCommand(message)) {
      return false;
    }
    const command = this.checkCommand(message);
    if (command === null) {
      return false;
    }
    assert(typeof command === "string");
    const tokens = command.split(" ");
    assert(tokens.length > 0);

    this.handleCommand(message, tokens);
    return true;
  }

  /**
   * Checks if the specified message has a command, and if there is, return it. Otherwise, return null.
   *
   * @param {*} message Message to check
   * @returns {?string} The command, or null if there isn't one
   * @memberof CommandHandler
   */
  checkCommand(message) {
    // Checks
    if (message.author.id === this.bot.client.user.id) {
      logger.debug("Is self");
      return null;
    }
    if (!message.isMentioned(this.bot.client.user)) {
      logger.debug("No mention");
      return null;
    }
    const tokens = message.cleanContent.split(" ");
    if (tokens.length === 1) {
      logger.debug("No command");
      return null;
    }
    const arg0 = tokens[1]; // [0] -> mention [1] -> command
    if (!arg0.startsWith(this.commandPrefix)) {
      logger.debug("No prefix");
      return null;
    }
    if (arg0.length === 1) {
      logger.debug("No content");
      return null;
    }

    // All checks pass
    const cmd = arg0.substr(this.commandPrefix.length).toLowerCase();
    logger.debug("Command: " + cmd);
    return cmd;
  }

  /**
   * Returns true if the message should be handled.
   *
   * @param {*} message The message
   * @returns {boolean}
   * @memberof CommandHandler
   */
  shouldHandleCommand(message) {
    if (this.bot.isIgnored(message.author, message.channel)) {
      logger.debug("false: User is ignored");
      return false;
    }
    return true;
  }

  /**
   * Handles a tokenized command with arguments.
   *
   * @example handleCommand(["say", "Hello", "World"])
   *
   * @param {*} message Context message
   * @param {Array.<String>} args Tokenized command with arguments.
   * @returns {boolean} Whether the command was handled
   * @memberof CommandHandler
   */
  handleCommand(message, args) {
    let isHandled = false;
    assert(args.length > 0);

    if (args[0] === "jvc") {
      this.jvc(message, args);
      isHandled = true;
    } else if (args[0] === "qvc") {
      this.qvc(message, args);
      isHandled = true;
    } else {
      assert(!isHandled);
      logger.debug("Command handler did not find any way to handle the command \"" + args + "\"");
    }
    return isHandled;
  }

  /**
   * Handles the "jvc" command.
   *
   * @param {*} message Context message
   * @param {*} args Args
   * @returns {boolean} True if success
   * @memberof CommandHandler
   */
  jvc(message, args) {
    // Perform checks

    if (!this.bot.voiceHandler.voiceChecks(message)) {
      return false;
    }

    // Check if the user is in a voice channel
    assert(message.guild);
    const voiceChannel = findMemberVoiceChannel(message.guild, message.author);
    if (voiceChannel === null) {
      logger.debug("JVC: Tried to activate voice chat but user is not in a voice channel.");
      return false;
    }

    // Check if bot has permission to join voice channel
    if (!voiceChannel.joinable) {
      logger.debug("JVC: No permission to join voice channel");
      return false;
    }

    // Checks done

    this.bot.voiceHandler.joinVoiceChannel(voiceChannel);
    return true;
  }

  /**
   * Handles the "qvc" command.
   *
   * @param {*} message Context message
   * @param {*} args Args
   * @returns {boolean} True if success
   * @memberof CommandHandler
   */
  qvc(message, args) {
    if (!this.bot.voiceHandler.voiceChecks(message)) {
      return false;
    }
    assert(message.guild);

    // Check if bot is in a voice channel
    const conn = this.bot.client.voiceConnections.get(message.guild.id);
    if (!conn) {
      logger.debug("QVC: No voice connection in guild with name \"" + message.guild.name + "\" and ID \"" + message.guild.id + "\".");
      return false;
    }

    // Checks passed

    conn.disconnect();
    return true;
  }
}

module.exports = {
  CommandHandler: CommandHandler
};