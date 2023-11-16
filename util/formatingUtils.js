
export function timestampToString(timestamp){
    const date = new Date(timestamp);
    const h = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    const sec = date.getSeconds().toString().padStart(2, '0');
    return `${h}:${min}:${sec}`;
}

export function limitStringLength(string, maxLength, postfix="..."){
    if(string.length > maxLength){
        return string.substring(0, maxLength - postfix.length) + postfix;
    }
    else{
        return string;
    }
}