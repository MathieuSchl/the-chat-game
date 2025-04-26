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

function rot(str, rotValue) {
    return str.replace(/[a-zA-Z]/g, function(c) {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode((c.charCodeAt(0) - base + rotValue) % 26 + base);
    });
}

const allType = ["removeVowels", "removeConsonants", "removeEveryOtherChar", "removeEveryOtherWord", "shuffleWord", "shuffleWordsInSentenceMiddle", "shuffleWordsInSentenceMiddle", "reverseWordsInSentence", "shuffleWords", "rot1", "rot13", "font-aurebesh"]
module.exports.applyCurrentRule = (input) => {
    if(randomMode) currentRule = allType[Math.floor(Math.random() * allType.length)];
    
    switch (currentRule) {
        case "removeVowels":
            return {text: removeVowels(input)};

        case "removeConsonants":
            return {text: removeConsonants(input)};

        case "removeEveryOtherChar":
            return {text: removeEveryOtherChar(input)};

        case "removeEveryOtherWord":
            return {text: removeEveryOtherWord(input)};

        case "shuffleWord":
            return {text: shuffleWordsInSentence(input)};

        case "shuffleWordsInSentenceMiddle":
            return {text: shuffleWordsInSentenceMiddle(input)};

        case "reverseWordsInSentence":
            return {text: reverseWordsInSentence(input)};
        
        case "shuffleWords":
            return {text: shuffleWords(input)};
    
        case "rot1":
            return {text: rot(input, 1)};

        case "rot13":
            return {text: rot(input, 13)};

        case "font-aurebesh":
            return {text: input, font: "font-aurebesh"};
    
        default:
            return {text: input};
    }
};