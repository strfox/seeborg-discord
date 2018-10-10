/* eslint "no-process-exit": off */

const {
  ArgumentParser
} = require("argparse");
const discord = require("discord.js");
const inquirer = require("inquirer");

const logger = require("./logging").getLogger(module);
const ffmpeg = require("./ffmpeg");
const seeborg4 = require("./seeborg4");
const confmod = require("./confmod");
const tts = require("./tts");
const utilmod = require("./utilmod");

const {
  SeeBorg4
} = seeborg4;
const {
  Database
} = require("./database");

const parser = new ArgumentParser({
  version: "4.0.4_1",
  addHelp: true,
  description: "SeeBorg4 for Node.js"
});
parser.addArgument(
  ["-c", "--config"], {
    help: "YAML config file for the bot",
    required: true
  }
);
const argsAgt = "--agt";
const argsAcceptGoogleTerms = "--accept-google-terms";
parser.addArgument(
  [argsAgt, argsAcceptGoogleTerms], {
    help: "Accept the Google Terms of Servicy and Privacy Policy",
    action: "storeTrue",
    dest: "acceptGoogleTerms"
  }
);
const args = parser.parseArgs();

/**
 * Loads configuration.
 *
 * @returns {void}
 */
function loadConfiguration() {
  return confmod.loadConfig(args.config);
}

/**
 * Verifies the requirements for starting up the bot.
 *
 * @param {*} config Configuration to verify
 * @returns {boolean} True if no requirements failed
 */
async function verifyRequirements(config) {
  if (config.voiceSettings.useVoice) {
    if (args.acceptGoogleTerms) {
      logger.info("Voice is enabled. By using voice features, you agree to the Google Terms of Service and Privacy Policy.");
    } else {
      const answers = await inquirer.prompt([{
        type: "confirm",
        name: "acceptTerms",
        default: false,
        message: "To use the voice features, you need to review and agree to " +
                    "the Google Terms of Service and Privacy Policy.\n" +
                    "If you do not wish to accept to these terms, please disable voice support in your configuration.\n" +
                    "Terms of Service: https://policies.google.com/terms\n" +
                    "Privacy Policy: https://policies.google.com/privacy\n\nAccept?"
      }]);
      if (answers.acceptTerms) {
        logger.info("Accepted. If you wish to skip this prompt whenever you start the bot," +
                    ` add "${argsAgt}" or "${argsAcceptGoogleTerms}" to the argument list.`);
      } else {
        const answers = await inquirer.prompt([{
          type: "confirm",
          name: "turnOffVoiceSupport",
          default: false,
          message: "You did not accept to the Terms of Service and the Privacy Policy." +
                        "Would you like to turn off voice features?"
        }]);
        if (answers.turnOffVoiceSupport) {
          config.voiceSettings.useVoice = false;
          confmod.writeConfig(args.config, config);
          logger.info("Voice features have been turned off. The bot will start up normally.");
          await utilmod.console.pause();
          return true;
        }
        logger.info("Because you did not agree to the Terms of Service and the Privacy Policy, " +
                    "you cannot continue with voice features enabled. The process will terminate.");
        await utilmod.console.pause();
        return false;
      }
    }
    if (ffmpeg.isInstalled()) {
      logger.info("ffmpeg found!");
    } else {
      logger.error("Cannot enable voice features: ffmpeg is not installed." +
                "Please install ffmpeg or disable voice features in your configuration.");
      return false;
    }
  }
  return true;
}

/**
 * Loads the database.
 *
 * @param {*} config Configuration file that specifies the database path
 * @returns {Database}
 */
function loadDatabase(config) {
  const database = new Database(config.databasePath);
  database.init();
  return database;
}

/**
 * Creates the chat client.
 *
 * @returns {Discord.Client}
 */
function makeClient() {
  const client = new discord.Client();
  client.on("error", () => logger.error("Connection down. Reconnecting..."));
  return client;
}

/**
 * Creates the SeeBorg4 instance.
 *
 * @param {*} client The chat client
 * @param {*} config The configuration for the bot
 * @param {*} database The database to be used by the bot
 * @returns {SeeBorg4} The bot
 */
function makeBot(client, config, database) {
  const bot = new SeeBorg4(client, config, database);
  return bot;
}

(async () => {
  logger.info("Loading configuration.");
  const config = loadConfiguration();
  logger.info("Making any necessary additions to your configuration.");
  confmod.verifyAndCorrectConfig(args.config, config);
  logger.info("Verifying requirements.");
  if (!await verifyRequirements(config)) {
    logger.error("The bot will not be started because the verification of requirements failed.");
    process.exit(0);
  }
  logger.info("Loading database.");
  const database = loadDatabase(config);
  logger.info("Creating Discord client.");
  const client = makeClient();
  logger.info("Creating the bot.");
  const bot = makeBot(client, config, database);
  logger.info("Starting the bot.");
  bot.start();
})();

// Clean up the tts temp folder on process exit
process.on("SIGINT", (options, exitCode) => {
  seeborg4.cleanup();
  tts.cleanup()
    .catch(err => logger.error(err))
    .finally(() => {
      logger.info("Goodbye!");
      process.exit();
    });
});