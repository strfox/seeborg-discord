/*
migrate.js

This script is used to migrate your old sequential lines file into the new mapped format.
It can take a few minutes to complete.

Example: node migrate.js -l lines.txt -o dictionary.json
         ^
         |_ Will convert the file 'lines.txt' to 'dictionary.json'
*/
'use strict';
const {
    ArgumentParser
} = require('argparse');
const fs = require("fs");
const Database = require('../src/database').Database;

const parser = new ArgumentParser({
    description: 'Migrate your old lines.txt to SeeBorg4',
});
parser.addArgument(['-l', '--lines'], {
    help: 'The path to your old lines.txt file.',
    required: true
});
parser.addArgument(['-o', '--output'], {
    help: 'The file to output to.',
    required: true
});
const args = parser.parseArgs();

let linesIn = fs.readFileSync(args.lines, 'utf8');
const database = new Database(args.output);
database.init();

linesIn = linesIn.split(/\r?\n/);
for (let i = 0; i < linesIn.length; i++) {
    const line = linesIn[i];
    console.log(line);
    database.insertLine(line);
    if (i % 500 === 0) {
        database.save();
    }
}
database.save();
