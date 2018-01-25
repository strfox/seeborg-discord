'use strict';
const jsyaml = require('js-yaml');
const logger = require('./logging');
const fs = require('fs');

class SeeBorg4Config {

    constructor(obj) {
        this.__dict = obj;
    }

    static loadConfig(filename) {
        let data = fs.readFileSync(filename);
        return new SeeBorg4Config(jsyaml.load(data));
    }

    token() {
        return this.__dict['token'];
    }

    databasePath() {
        return this.__dict['databasePath'];
    }

    autoSavePeriod() {
        return this.__dict['autoSavePeriod'];
    }

    isIgnored(authorId, channelId) {
        return this.__behavior(channelId, 'ignoredUsers').includes(authorId);
    }

    matchesBlacklistedPattern(channelId, line) {
        let patterns = this.__behavior(channelId, 'blacklistedPatterns');

        for (let pattern of patterns) {
            let regex = new RegExp(pattern, 'mi');
            if (regex.test(line)) {
                logger.debug(`BLACKLISTED PATTERN [${pattern}] MATCHED [${line}]`);
                return true;
            }
        }
        return false;
    }

    matchesMagicPattern(channelId, line) {
        let patterns = this.__behavior(channelId, 'magicPatterns');

        for (let pattern of patterns) {
            let regex = new RegExp(pattern, 'mi');
            if (regex.test(line)) {
                logger.debug(`MAGIC PATTERN [${pattern}] MATCHED [${line}]`);
                return true;
            }
        }
        return false;
    }

    replyRate(channelId) {
        return this.__behavior(channelId, 'replyRate');
    }

    replyMention(channelId) {
        return this.__behavior(channelId, 'replyMention');
    }

    replyMagic(channelId) {
        return this.__behavior(channelId, 'replyMagic');
    }

    speaking(channelId) {
        return this.__behavior(channelId, 'speaking');
    }

    learning(channelId) {
        return this.__behavior(channelId, 'learning');
    }

    /**
     * Returns the property for the given channel if it's overridden;
     * otherwise, it returns the
     * property from the default, root behavior.
     * 
     * @param {String} channelId 
     * @param {String} propertyName 
     */
    __behavior(channelId, propertyName) {
        let defaultValue = this.__dict['behavior'][propertyName];
        let override = this._overrideForChannel(channelId);

        if (override === null || !override['behavior'].hasOwnProperty(propertyName)) {
            return defaultValue;
        } else {
            logger.debug(`OVERRIDEN BEHAVIOR ${propertyName} IN ${channelId}`);
            return override['behavior'][propertyName];
        }
    }

    /**
     * Returns the override object for the channel with the given id.
     * 
     * @param {String} channelId 
     * @returns {?Object}
     */
    _overrideForChannel(channelId) {
        for (let override of this.__dict['channelOverrides']) {
            if (override['channelId'] === channelId) {
                return override;
            }
        }
        return null;
    }
}

module.exports = {
    SeeBorg4Config: SeeBorg4Config
};