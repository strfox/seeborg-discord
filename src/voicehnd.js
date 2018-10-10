"use strict";
const _ = require("underscore");

const logger = require("./logging").getLogger(module);
const tts = require("./tts");

class VoiceHandler {
  /**
   * Creates an instance of VoiceHandler.
   * @param {*} bot Bot
   * @memberof VoiceHandler
   *
   * @prop {*} bot
   */
  constructor(bot) {
    this.bot = bot;
  }

  /**
   * @param {*} conn Connection (has to be curried)
   * @param {*} user User that triggered the event
   * @param {boolean} speaking Whether user is speaking
   * @returns {boolean}
   *
   * @throws {Error} If an error occurs while synthesizing text
   * @throws {Error} If an error occurs while playing audio
   *
   * @memberof VoiceHandler
   */
  async onUserSpeak(conn, user, speaking) {
    if (user.id === this.bot.client.id) {
      return false;
    }

    // Temporary synthesization string
    const randomString = _.sample(this.bot.database.dictionary.sentences);

    // Synthesize
    logger.debug("Synthesizing text: " + randomString);
    let filenames = await tts.synthesize(randomString);

    // Play
    logger.debug("Playing audio files: " + filenames);
    const playFiles = i => {
      return new Promise((resolve, reject) => {
        if (i < filenames.length) {
          logger.debug(`Playing file "${filenames[i]}", files left: ${filenames.length - i}`);
          const dispatcher = conn.playFile(filenames[i]);

          dispatcher.on("end", () => {
            logger.debug("Playing next file!");
            playFiles(i + 1)
              .then(() => resolve())
              .catch((err) => reject(err));
          });
          dispatcher.on("error", err => reject(err));
        } else {
          resolve();
        }
      });
    };

    await playFiles(0);
    logger.debug("Done playing all audios.");
    return true;
  };

  /**
   * Utility method to determine whether a message can interact with any voice functionality of the bot.
   *
   * @param {*} message The message
   * @returns {boolean} True if all checks passed
   * @memberof VoiceHandler
   */
  voiceChecks(message) {
    // Check if the message is in a guild
    if (!message.guild) {
      logger.debug("VoiceChecks: Message was not sent in a guild!");
      return false;
    }
    // Check if voice is enabled
    if (!this.bot.config.voiceSettings.useVoice) {
      logger.debug("VoiceChecks: Voice is disabled!");
      return false;
    }
    // Check if user has permission to request bot to join voice channel
    if (this.bot.config.voiceSettings.acceptInvitesFrom.indexOf(message.author.id) === -1) {
      logger.debug("VoiceChecks: " + message.author.username + " does not have permission to perform voice chat operations.");
      return false;
    }
    return true;
  }

  /**
   * Joins a voice channel.
   *
   * @param {*} voiceChannel The voice channel to join
   * @returns {void}
   * @memberof VoiceHandler
   */
  joinVoiceChannel(voiceChannel) {
    voiceChannel.join()
      .then(conn => {
        logger.info("Joined voice channel");
        // Add listener to "speaking" event
        conn.on("speaking", (user, speaking) => {
          this.bot.voiceHandler.onUserSpeak(conn, user, speaking)
            .catch(err => logger.error("Error while speaking: " + err));
        });
      })
      // Handle join voice channel errors
      .catch(err => logger.debug("Could not join voice channel: " + err));
  }
}

module.exports = {
  VoiceHandler: VoiceHandler
};