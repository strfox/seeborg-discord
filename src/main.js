'use strict';
const argparse = require('argparse');
const discord = require('discord.js');
const fs = require("fs");

const logger = require('./logging');
const SeeBorg4 = require('./seeborg4').SeeBorg4;
const SeeBorg4Config = require('./config').SeeBorg4Config;
const SeeBorg4Database = require('./database').SeeBorg4Database;

const parser = new argparse.ArgumentParser({
    version: '4.0.0',
    addHelp: true,
    description: 'SeeBorg4 for Node.js'
});
parser.addArgument(
    ['-c', '--config'],
    {
        help: 'YAML config file for the bot',
        required: true
    }
);
const args = parser.parseArgs();


// Load configuration
let config = SeeBorg4Config.loadConfig(args.config);

// Load database
let database = new SeeBorg4Database(config.databasePath());
database.init();


// Instantiate client
let client = new discord.Client();


// Instantiate bot and start it
let bot = new SeeBorg4(client, config, database);
bot.start();