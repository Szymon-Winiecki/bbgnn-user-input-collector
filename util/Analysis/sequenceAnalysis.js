export function retrieveEnteredPhrase(sequence){

    let phrase = new Array();

    for(let i = 0; i < sequence.length; ++i){
        let cursor = i;
        let toRemove = 0;
        let toInsert = [];
        if(sequence[i].cursorPosition != undefined){   
            cursor = parseInt(sequence[i].cursorPosition);
        }

        if(sequence[i].selectionEnd != undefined && sequence[i].selectionEnd != cursor){    // if some text is selected
            if(sequence[i].key.length == 1 || sequence[i].key == 'Backspace' || sequence[i].key == 'Delete'){ // and printable character or backspace or delete was pressed
                toRemove = sequence[i].selectionEnd - cursor;   //remove selected charactes
            }
        }
        else if(sequence[i].key == 'Backspace'){
            toRemove = 1;
            cursor = Math.max(0, cursor-1);
        }
        else if(sequence[i].key == 'Delete'){
            toRemove = 1;
        }
        
        if(sequence[i].key.length == 1){ // only strings of length 1 represents printable characters
            toInsert.push(sequence[i].key);
        }

        phrase.splice(cursor, toRemove, ...toInsert);
        
    }

    return phrase.join('');
}

// the structure of the collected data varies between diffrent versions of the application. This function returns the compatibility with phrase retrieving function on a scale of <0;2>, where 0 means the worse compatibility and 2 means the best 
export function phraseRetrivingCompatibility(sequence){
    if(sequence.length == 0 || sequence[0].selectionEnd != undefined){
        return 2;
    }
    if(sequence[0].cursorPosition != undefined){
        return 1;
    }
    else return 0;
}