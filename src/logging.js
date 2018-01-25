const winston = require('winston');

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: () => {
                return new Date().toLocaleString();
            },
            colorize: false,
            level: 'debug'
        }),
        new (winston.transports.File)({
            level: 'error',
            filename: 'seeborg4.log'
        }),
    ]
});

module.exports = logger;