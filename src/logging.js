"use strict";
const path = require("path");
const winston = require("winston");
const {
  transports,
  format
} = winston;
const {
  combine,
  timestamp,
  label,
  printf,
  colorize
} = format;

const DEFAULT_CONSOLE_LEVEL = process.env.NODE_ENV === "dev" ? "debug" : "info"
const DEFAULT_FILE_LEVEL = "error";
const DEFAULT_FILENAME = "seeborg4.log";

const MY_FORMAT = printf(info => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`);

function consoleTransport() {
  return new (transports.Console)({
    timestamp: () => new Date().toLocaleString(),
    colorize: true,
    level: DEFAULT_CONSOLE_LEVEL
  });
}

function fileTransport() {
  return new (transports.File)({
    level: DEFAULT_FILE_LEVEL,
    filename: DEFAULT_FILENAME
  });
}

function getLabelFor(module_) {
  const projectRoot = path.resolve(__dirname, "..");
  const moduleFilename = path.normalize(module_.filename);
  return path.relative(projectRoot, moduleFilename);
}

module.exports = {
  getLogger(module_) {
    let labelStr = getLabelFor(module_);
    return winston.createLogger({
      format: combine(
        colorize(),
        label({
          label: labelStr
        }),
        timestamp({
          format: "YYYY-MM-DD HH:mm:ss"
        }),
        MY_FORMAT
      ),
      transports: [consoleTransport(), fileTransport()]
    })
  }
}