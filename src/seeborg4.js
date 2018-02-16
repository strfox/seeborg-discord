'use strict';
const logger = require('./logging');
const stringUtil = require('./stringutil');
const _ = require('underscore');


class SeeBorg4 {
    constructor(client, config, database) {
        this.__client = client;
        this.__config = config;
        this.__database = database;
    }

    start() {
        logger.info('SeeBorg4 is starting');
        this.__registerListeners();
        this.__startAutoSaveJob();
        this.__client.login(this.__config.token())
    }

    onReady() {
        logger.info('Connected to Discord!');
    }

    onMessage(message) {
        logger.info(`MSG ${message.channel.id} ${message.author.id} ${message.content}`);

        if (this.__shouldProcessMessage(message)) {
            if (this.__shouldComputeAnswer(message)) {
                this.__replyWithAnswer(message.channel, message.cleanContent);
            }
            if (this.__shouldLearn(message)) {
                this.__learn(message.cleanContent);
            }
        }
    }

    __replyWithAnswer(channel, cleanContent) {
        logger.debug('In method: __replyWithAnswer');
        let response = this.__compute_answer(cleanContent);

        if (response === null) {
            logger.debug('RESPONSE WAS NULL');
        } else {
            channel.send(response).catch((err) => {
                logger.error(err);
            });
        }
    }

    __compute_answer(fromLine) {
        let lowercaseLine = fromLine.toLowerCase();
        let words = stringUtil.splitWords(lowercaseLine);
        let knownWords = words.filter((word) => this.__database.isWordKnown(word));
        let pivot = _.sample(knownWords);
        let sentences = this.__database.sentencesWithWord(pivot);

        if (sentences.length === 0) {
            return null;
        } else if (sentences.length === 1) {
            return sentences[0];
        }

        let leftSentence = _.sample(sentences);
        let rightSentence = _.sample(sentences);
        let leftSentenceWords = stringUtil.splitWords(leftSentence);
        let rightSentenceWords = stringUtil.splitWords(rightSentence);
        let leftSide = leftSentenceWords.slice(0, leftSentenceWords.indexOf(pivot));
        let rightSide = rightSentenceWords.slice(rightSentenceWords.indexOf(pivot) + 1, rightSentenceWords.length);

        return [leftSide.join(' '), pivot, rightSide.join(' ')].join(' ');
    }

    __shouldComputeAnswer(message) {
        // Bot should not speak if speaking is set to false
        if (!this.__config.speaking(message.channel.id)) {
            return false;
        }

        // Bot should not speak if they don't have permission
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) {
            return false;
        }

        // Utility function
        function chancePredicate(chancePercentage, predicate) {
            let randInt = Math.random() * 99; // Generate a random number between 0 and 99
            if (chancePercentage > 0 && predicate()) {
                if (chancePercentage > randInt || chancePercentage === 100) {
                    return true;
                }
            }
            return false;
        }

        // Reply mention
        let replyMention = this.__config.replyMention(message.channel.id);
        if (chancePredicate(replyMention, () => message.isMentioned(this.__client.user))) {
            logger.debug('REPLY MENTION');
            return true;
        }

        // Reply magic
        let replyMagic = this.__config.replyMagic(message.channel.id);
        if (chancePredicate(replyMagic, () => this.__config.matchesMagicPattern(message.channel.id, message.cleanContent))) {
            logger.debug('REPLY MAGIC');
            return true;
        }

        // Reply rate
        let replyRate = this.__config.replyRate(message.channel.id);
        if (chancePredicate(replyRate, () => true)) {
            logger.debug('REPLY RATE');
            return true
        }

        logger.debug('REPLY FAIL');
        return false;
    }

    __learn(line) {
        logger.debug('In method: __learn');
        try {
            this.__database.insertLine(line.toLowerCase());
        } catch (ex) {
            logger.debug(ex.toString());
        }
    }

    __shouldLearn(message) {
        if (!this.__config.learning(message.channel.id)) {
            return false;
        }

        // Ignore messages that match the blacklist
        if (this.__config.matchesBlacklistedPattern(message.channel.id, message.cleanContent)) {
            logger.debug(`IS BLACKLISTED ${message}`);
            return false;
        }

        return true;
    }

    __shouldProcessMessage(message) {
        // Ignore own messages
        if (this.__isOwnMessage(message)) {
            return false;
        }

        // Ignore users in the ignore list
        if (this.__config.isIgnored(message.author.id, message.channel.id)) {
            logger.debug(`IGNORE ${message.author.id}`);
            return false;
        }

        return true;
    }

    __isOwnMessage(message) {
        return message.author.id === this.__client.user.id;
    }

    __registerListeners() {
        this.__client.on('ready', this.onReady.bind(this));
        this.__client.on('message', this.onMessage.bind(this));
    }

    __startAutoSaveJob() {
        setInterval(() => {
            logger.info('Saving dictionary ...');
            this.__database.save();
            logger.info('Saved!');
        }, this.__config.autoSavePeriod() * 1000);
    }
}

module.exports = {
    SeeBorg4: SeeBorg4
};