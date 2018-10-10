/*
rebuild.js

This script is used to rebuild your mapped bot dictionary if it was manually modified or found corrupted.
It can take a few minutes to complete.

Example: node rebuild.js -i dictionary-broken.json -o dictionary-fixed.json
*/
'use strict';
const {
    ArgumentParser
} = require('argparse');
const fs = require('fs');
const Database = require('../src/database').Database;

const parser = new ArgumentParser({
    help: "Rebuilds a database."
});
parser.addArgument(
    ['-i', '--input'], {
        help: "Input JSON file",
        required: true
    }
);
parser.addArgument(
    ['-o', '--output'], {
        help: "Output JSON file",
        required: true
    }
);
parser.addArgument(
    ['-v', '--verbose'], {
        action: 'storeTrue',
        help: 'Verbose mode'
    }
)
const args = parser.parseArgs();

console.log('Initializing database');
const db = new Database(args.output);
db.init();
console.log('Database initialized');

const obj = JSON.parse(fs.readFileSync(args.input, 'utf8'));

for (let sentence of obj.sentences) {
    if (args.verbose) {
        console.log(sentence);
    }
    db.insertLine(sentence);
}

db.save();
console.log('Done!');