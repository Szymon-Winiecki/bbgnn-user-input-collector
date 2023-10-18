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

export {GetRandomInteger, GetElementById};