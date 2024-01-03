
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