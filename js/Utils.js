function GetRandomInteger(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

function GetElementById(id){
    const element = document.getElementById(id);
    if(!element){
        console.error(`Could not find element(id="${id}")`);
        return undefined;
    }
    return element;
}

function TimestampToTimeString(timestamp){
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

export {GetRandomInteger, GetElementById, TimestampToTimeString};