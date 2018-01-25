'use strict';
const fs = require('fs');
const _ = require('underscore');

const logger = require('./logging');
const stringUtil = require('./stringutil');
const splitWords = stringUtil.splitWords;
const splitSentences = stringUtil.splitSentences;

/**
 * @typedef {Object} Dictionary
 * @property {Array<String>} sentences
 * @property {Array<Object>} mappings
 */


class SeeBorg4Database {

    constructor(filename) {
        this.__filename = filename;
        this.__dictionary = null;
    }

    init() {
        if (!fs.existsSync(this.__filename)) {
            fs.writeFileSync(this.__filename, '{"sentences":[],"mappings":{}}');
        }

        let data = fs.readFileSync(this.__filename, 'utf8');
        this.__dictionary = JSON.parse(data);
    }

    save() {
        let json = JSON.stringify(this.__dictionary);
        fs.writeFileSync(this.__filename, json, {
            encoding: 'utf8',
            flag: 'w+'
        });
    }

    insertLine(line) {
        for (let sentence of splitSentences(line)) {
            this.__insertSentence(sentence);
        }
    }

    isWordKnown(word) {
        return this.__wordIndexList(word) !== null;
    }

    sentencesWithWord(word) {
        let indexList = this.__wordIndexList(word);
        if (indexList === null) {
            return [];
        }
        return indexList.map(index => this.__dictionary.sentences[index]);
    }

    __insertSentence(sentence) {
        if (!this.__hasSentence(sentence)) {
            this.__dictionary.sentences.push(sentence);
            const sentenceIndex = this.__dictionary.sentences.length - 1;
            for (let word of splitWords(sentence)) {
                this.__insertWord(word, sentenceIndex);
            }
        }
    }

    __insertWord(word, sentenceIndex) {
        let wordIndexList = this.__wordIndexList(word);
        if (wordIndexList === null) {
            this.__dictionary.mappings[word] = [sentenceIndex]
        } else {
            if (!wordIndexList.includes(sentenceIndex)) {
                wordIndexList.push(sentenceIndex);
            }
        }
    }

    __hasSentence(sentence) {
        return this.__dictionary.sentences.includes(sentence);
    }

    __wordIndexList(word) {
        let indexList = this.__dictionary.mappings[word];
        if (indexList === null || indexList === undefined) {
            return null;
        } else {
            return indexList;
        }
    }
}

module.exports = {
    SeeBorg4Database: SeeBorg4Database
};