"use strict";
const fs = require("fs");
const writeFileAtomicSync = require("write-file-atomic").sync;

const stringUtil = require("./stringutil");
const splitWords = stringUtil.splitWords;
const splitSentences = stringUtil.splitSentences;

/**
 * @typedef Dictionary
 * @description A SeeBorg4 dictionary.
 * @prop {Array.<String>} sentences
 * @prop {Object.<String, Number>} mappings
 */

/**
 * @class Database
 */
class Database {
  /**
   * Creates an instance of Database.
   *
   * @param {string} filename File on disk to represent this database
   * @memberof Database
   *
   * @prop {string} filename File on disk to represent this database
   * @prop {Dictionary} dictionary
   */
  constructor(filename) {
    this.filename = filename;
    this.dictionary = null;
  }

  /**
   * Initializes this database.
   *
   * @returns {Promise.<void, Error>}
   * @memberof Database
   */
  init() {
    if (!fs.existsSync(this.filename)) {
      this.writeEmpty();
    }
    this.read();
  }

  /**
   * Writes an empty database to disk.
   *
   * @private
   * @returns {void}
   * @memberof Database
   */
  writeEmpty() {
    writeFileAtomicSync(this.filename, "{\"sentences\":[],\"mappings\":{}}");
  }

  /**
   * Reads database from disk.
   *
   * @private
   * @returns {Promise.<void, Error>}
   * @memberof Database
   */
  read() {
    const data = fs.readFileSync(this.filename, "utf8");
    this.dictionary = JSON.parse(data);
  }

  /**
   * Writes database to disk.
   *
   * @memberof Database
   * @returns {void}
   */
  save() {
    const json = JSON.stringify(this.dictionary);
    writeFileAtomicSync(this.filename, json, {
      encoding: "utf8"
    });
  }

  /**
   * Inserts a line into the database.
   *
   * @param {string} line The line to insert
   * @memberof Database
   * @returns {void}
   */
  insertLine(line) {
    for (let sentence of splitSentences(line)) {
      this.insertSentence(sentence);
    }
  }

  /**
   * Returns true if the specified word is found in this database.
   *
   * @param {string} word Word to look up
   * @returns {boolean}
   * @memberof Database
   */
  isWordKnown(word) {
    return this.wordIndexList(word) !== null;
  }

  /**
   * Returns a list of sentences with the specified word.
   *
   * @param {string} word The word to look up
   * @returns {Array.<String>}
   * @memberof Database
   */
  sentencesWithWord(word) {
    const indexList = this.wordIndexList(word);
    if (indexList === null) {
      return [];
    }
    return indexList.map(index => this.dictionary.sentences[index]);
  }

  /**
   * Inserts a sentence into the dictionary.
   *
   * @param {string} sentence The sentence to insert
   * @returns {void}
   * @memberof Database
   */
  insertSentence(sentence) {
    if (!this.hasSentence(sentence)) {
      this.dictionary.sentences.push(sentence);
      const sentenceIndex = this.dictionary.sentences.length - 1;
      for (let word of splitWords(sentence)) {
        this.insertWord(word, sentenceIndex);
      }
    }
  }

  /**
   * Inserts a word into the dictionary.
   *
   * @param {string} word The word to insert
   * @param {number} sentenceIndex The index of the sentence it belongs to
   * @returns {void}
   * @memberof Database
   */
  insertWord(word, sentenceIndex) {
    const wordIndexList = this.wordIndexList(word);
    if (wordIndexList === null) {
      this.dictionary.mappings[word] = [sentenceIndex];
    } else {
      if (!wordIndexList.includes(sentenceIndex)) {
        wordIndexList.push(sentenceIndex);
      }
    }
  }

  /**
   * Returns true if the dictionary contains the specified sentence.
   *
   * @param {string} sentence The sentence to look up
   * @returns {boolean}
   * @memberof Database
   */
  hasSentence(sentence) {
    return this.dictionary.sentences.includes(sentence);
  }

  /**
   * Returns a list of indexes of sentences containing the specified word.
   *
   * @param {string} word The word to look up
   * @returns {?Array.<Number>}
   * @memberof Database
   */
  wordIndexList(word) {
    const indexList = this.dictionary.mappings[word];
    if (indexList === null || indexList === undefined) {
      return null;
    } else {
      return indexList;
    }
  }
}

module.exports = {
  Database: Database
};