const levenshtein = require('js-levenshtein');

export function getErrorsCount(original, typed){
    return levenshtein(original, typed);
}