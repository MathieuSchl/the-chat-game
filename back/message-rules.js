let currentRule = "Rien";
let randomMode = false;

module.exports.setCurrentRule = (value) => {
    currentRule = value;
}

module.exports.getCurrentRule = () => {
    return currentRule;
}

module.exports.setRandomMode = (value) => {
    randomMode = value;
}

module.exports.getRandomMode = () => {
    return randomMode;
}

function removeVowels(str) {
    return str.replace(/[aeiouyAEIOUY]/g, '');
  }

function removeConsonants(str) {
return str.replace(/[bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ]/g, '');
}

function removeEveryOtherChar(str) {
    return str
      .split('')
      .filter((char, index) => index % 2 === 0)
      .join('');
  }

function removeEveryOtherWord(str) {
return str
    .split(' ')                // découpe en mots
    .filter((word, index) => index % 2 === 0) // garde un mot sur deux
    .join(' ');
}

function shuffleWord(word) {
    return word
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
}
  
function shuffleWordsInSentence(sentence) {
return sentence
    .split(' ')
    .map(shuffleWord)
    .join(' ');
}


function shuffleWordMiddle(word) {
if (word.length <= 3) {
    // Si le mot a 3 lettres ou moins, on ne mélange pas
    return word;
}
const firstLetter = word.charAt(0);
const lastLetter = word.charAt(word.length - 1);
const middle = word.slice(1, -1).split('');
for (let i = middle.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [middle[i], middle[j]] = [middle[j], middle[i]]; // Échange
}
return firstLetter + middle.join('') + lastLetter;
}

function shuffleWordsInSentenceMiddle(sentence) {
return sentence
    .split(' ')
    .map(shuffleWordMiddle)
    .join(' ');
}

function reverseWordsInSentence(sentence) {
    return sentence
      .split(' ')                // Découpe la phrase en mots
      .reverse()                 // Inverse l'ordre des mots
      .join(' ');                // Rejoint les mots pour reformer la phrase
}

function shuffleWords(sentence) {
    return sentence
      .split(' ')                // Découpe la phrase en mots
      .sort(() => Math.random() - 0.5) // Mélange aléatoirement les mots
      .join(' ');                // Recompose la phrase
}

const allType = ["removeVowels", "removeConsonants", "removeEveryOtherChar", "removeEveryOtherWord", "shuffleWord", "shuffleWordsInSentenceMiddle", "shuffleWordsInSentenceMiddle", "reverseWordsInSentence", "shuffleWords"]
module.exports.applyCurrentRule = (input) => {
    if(randomMode) currentRule = allType[Math.floor(Math.random() * allType.length)];
    
    switch (currentRule) {
        case "removeVowels":
            return removeVowels(input);

        case "removeConsonants":
            return removeConsonants(input);

        case "removeEveryOtherChar":
            return removeEveryOtherChar(input);

        case "removeEveryOtherWord":
            return removeEveryOtherWord(input);

        case "shuffleWord":
            return shuffleWordsInSentence(input);

        case "shuffleWordsInSentenceMiddle":
            return shuffleWordsInSentenceMiddle(input);

        case "reverseWordsInSentence":
            return reverseWordsInSentence(input);
        
        case "shuffleWords":
            return shuffleWords(input);
    
        default:
            return input;
    }
};