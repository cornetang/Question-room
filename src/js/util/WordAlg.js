import _ from "lodash";

const wordFilter = [
    "while", "although", "however", "neither", "either", "which", "whose",
    "since", "should", "would", "could", "shall", "because", "otherwise",
    "although", "moreover", "conclusion", "super", "difficult", "might",
    "maybe", "first", "second", "third", "belive", "thousand", "million",
    "please", "anyone", "anybody", "someone", "available", "something", "thing",
    "things", "great", "these", "those", "bitch", "thank", "think", "never",
    "always", "sometimes", "usually", "often", "rarely", "willing", "nobody"
];

export function countWords(srcString) {
    return _.chain(srcString)
        .words(/[^, ,\;,\,,\/,\&]+/g)
        .value()
        .length;
}

export function findFreqWords(srcString, topCount = 3, minLength = 4) {
    return _.chain(srcString)
        .words(/[^, ,\;,\,,\/,\&]+/g)
        .countBy()
        .pairs()
        .sortBy(pair => -1 * pair[1])
        .pluck(0)
        .filter(word =>
            word.search(/^[A-Z][A-Z0-9]*/i) > -1 &&
            word.length > minLength &&
            word.length < 33 &&
            !_.includes(wordFilter, word.toLowerCase()))
        .take(topCount)
        .map(w => w.replace(/\W/g, ""))
        .value();
}
