
export function splitIntoWords(data){
    if(Array.isArray(data)){
        return data.flatMap(d => wordsSplit(d));
    }
    else{
        return wordsSplit(data);
    }
}

function wordsSplit(data){
    const wordsSeparators = new Set([' ']);

    const words = []
    
    let k = 0;
    function getWordDataTemplate(){
        return {
            user: data.user,
            finishDate: data.finishDate + ++k,
            phrase: '?',
            sequence: []
        }
    }

    function transformEvent(event, splitTime){
        return{
            key: event.key,
            keyDownTime: event.keyDownTime - splitTime,
            keyUpTime: event.keyUpTime - splitTime
        }
    }

    let word = getWordDataTemplate();
    let relativeTimeStart = 0;
    for(let i = 0; i < data.sequence.length; ++i){
        if(wordsSeparators.has(data.sequence[i].key)){
            words.push({...word});
            word = getWordDataTemplate();
        }
        else{
            if(word.sequence.length == 0) relativeTimeStart = data.sequence[i].keyDownTime;
            word.sequence.push(transformEvent(data.sequence[i], relativeTimeStart))
        }
    }

    if(word.sequence.length != 0){
        words.push({...word});
    }

    return words
}