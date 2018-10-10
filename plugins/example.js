'use strict';
const logger = require('../src/logging').getLogger(module);

module.exports = {
    getName: function () {
        return "ExamplePlugin";
    },

    init: function (bot) {
        logger.info('Hello world! ' + bot);
    },

    destroy: function () {
        logger.info('Bye world :(');
    }
};