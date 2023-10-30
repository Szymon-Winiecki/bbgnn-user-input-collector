
export function timestampToString(timestamp){
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

export function limitStringLength(string, maxLength, postfix="..."){
    if(string.length > maxLength){
        return string.substring(0, maxLength - postfix.length) + postfix;
    }
    else{
        return string;
    }
}