const randomWords = require('random-words');
function guessWord() {
    let word = randomWords();
    return word;
}

module.exports = (guessWord);