
export function timestampToTimeString(timestamp){
    const date = new Date(timestamp);
    const h = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    const sec = date.getSeconds().toString().padStart(2, '0');
    return `${h}:${min}:${sec}`;
}

export function timestampToDateString(timestamp){
    const date = new Date(timestamp);
    const year = date.getFullYear().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}.${month}.${year}`;
}

export function timestampToDateTimeString(timestamp){
    const date = new Date(timestamp);
    return `${timestampToDateString(timestamp)} ${timestampToTimeString(timestamp)}`;
}

// for input[type='datetime-local']
export function timestampToNormalizedString(timestamp){
    const date = new Date(timestamp);
    const h = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    const sec = date.getSeconds().toString().padStart(2, '0');
    const year = date.getFullYear().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${h}:${min}:${sec}`;
}

export function limitStringLength(string, maxLength, postfix="..."){
    if(string.length > maxLength){
        return string.substring(0, maxLength - postfix.length) + postfix;
    }
    else{
        return string;
    }
}