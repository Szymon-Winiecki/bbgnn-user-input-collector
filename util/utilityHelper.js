
export function recordsOnPage(all, page, itemsOnPage){
    const from = (page - 1) * itemsOnPage;
    const to = from + itemsOnPage;
    return {
        from: Math.min(from, all),
        to: Math.min(to, all)
    }
}

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
export function randomAlphanumString(length){
    const result = [];
    for(let i = 0; i < length; ++i){
        const rid = parseInt(Math.random() * alphabet.length);
        result.push(alphabet[rid]);
    }
    return result.join('');
}

export function includesCharacter(text, characters){
    for(let i = 0; i < characters.length; ++i){
        if(text.includes(characters[i])){
            return true;
        }
    }
    return false;
}

export function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}