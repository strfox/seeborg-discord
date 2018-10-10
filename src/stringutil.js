"use strict";

const RE_SPLIT_WORDS = /\s+|[,.!?:]+(\s|$)+/m;
const RE_SPLIT_SENTENCES = /(?<=[.!?])(\s+)/m;

/**
 * Extracts words from the given string.
 *
 * @param {string} str String to split
 * @returns {Array.<String>} Words from the string
 */
function splitWords(str) {
  return removeEmpty(str.split(RE_SPLIT_WORDS));
}

/**
 * Extracts sentences from the string
 *
 * @param {string} str String to split
 * @returns {Array.<String>} Sentences from the string
 */
function splitSentences(str) {
  return removeEmpty(str.split(RE_SPLIT_SENTENCES));
}

module.exports = {
  splitWords: splitWords,
  splitSentences: splitSentences
};

/**
 * Removes undefined, null and empty strings from the given array.
 *
 * @param {Array.<String>} strArr The array
 * @returns {Array.<String>} Array without null or undefined elements, or empty strings
 */
function removeEmpty(strArr) {
  return strArr.filter(el => el !== null && el !== undefined && el.trim() !== "");
}