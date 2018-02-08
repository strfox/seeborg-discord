'use strict';
const argparse = require('argparse');
const fs = require('fs');
const SeeBorg4Database = require('../src/database').SeeBorg4Database;

let parser = new argparse.ArgumentParser({
    help: "Rebuilds a database."
});
parser.addArgument(
    ['-i', '--input'],
    {
        help: "Input JSON file",
        required: true
    }
);
parser.addArgument(
    ['-o', '--output'],
    {
        help: "Output JSON file",
        required: true
    }
);
parser.addArgument(
    ['-v', '--verbose'],
    {
        action: 'storeTrue',
        help: 'Verbose mode'
    }
)
let args = parser.parseArgs();

console.log('Initializing database');
let db = new SeeBorg4Database(args.output);
db.init();
console.log('Database initialized');

let obj = JSON.parse(fs.readFileSync(args.input, 'utf8'));

for (let sentence of obj.sentences) {
    if (args.verbose) {
        console.log(sentence);
    }
    db.insertLine(sentence);
}

db.save();
console.log('Done');