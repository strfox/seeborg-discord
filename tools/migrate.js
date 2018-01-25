const argparse = require('argparse');
const fs = require("fs");
const SeeBorg4Database = require('../src/database').SeeBorg4Database;

const parser = new argparse.ArgumentParser({
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
let args = parser.parseArgs();


let linesIn = fs.readFileSync(args.lines, 'utf8');
let database = new SeeBorg4Database(args.output);
database.init();

linesIn = linesIn.split(/\r?\n/);
for (let i = 0; i < linesIn.length; i++) {
    let line = linesIn[i];
    console.log(line);
    database.insertLine(line);
    if (i % 500 === 0) {
        database.save();
    }
}