'use strict';

const RE_SPLIT_WORDS = /\s+|[,.!?:]+(\s|$)+/m;
const RE_SPLIT_SENTENCES = /(?<=[.!?])(\s+)/m;


function splitWords(str) {
    return __removeEmpty(str.split(RE_SPLIT_WORDS));
}

function splitSentences(str) {
    return __removeEmpty(str.split(RE_SPLIT_SENTENCES));
}

function __removeEmpty(strArr) {
    return strArr.filter(el => 
        el !== null && el !== undefined && el.trim() !== '');
}


module.exports = {
    splitWords: splitWords,
    splitSentences: splitSentences
};