import KeyboardInputData from "./KeyboardInputData.js";

const phrases = [
    "Stop waiting for exceptional things to just happen.",
    "You're good at English when you know the difference between a man eating chicken and a man-eating chicken.",
    "Written warnings in instruction manuals are worthless since rabbits can't read.",
];

const phraseToRetypeId = "phrase-to-retype";
const retypeInputId = "phrase-intput";
const submitButtonId = "submit-button";

let currentKeyboardInputData;
let currentPhrase;
let currentUser;

window.onload = Main;

function Main(){
    AddListeners();

    const submitButtonElement = document.getElementById(submitButtonId);
    if(submitButtonElement){
        submitButtonElement.addEventListener('click', Submit)
    }
    else{
        console.error(`Could not find phrase element(id="${phraseToRetypeId}")`);
    }

    Submit();
}

function SetNewPhrase(id){
    if(!id){
        id = GetRandomInteger(0, phrases.length);
    }
    else if(id < 0 || id >= phrases.length){
        console.error(`There is no phrase with given id (${id})`);
        return;
    }
    currentPhrase = phrases[id];

    const phraseToRetypeElement = document.getElementById(phraseToRetypeId);
    if(phraseToRetypeElement){
        phraseToRetypeElement.innerText = currentPhrase;
    }
    else{
        console.error(`Could not find phrase element(id="${phraseToRetypeId}")`);
    }
}

function GetRandomInteger(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

function AddListeners(){
    const phraseInputElement = document.getElementById(retypeInputId);
    if(phraseInputElement){
        phraseInputElement.addEventListener("keydown", (event) => {
            currentKeyboardInputData.RegisterKeyDown(event.key, event.timeStamp);
        });
        phraseInputElement.addEventListener("keyup", (event) => {
            currentKeyboardInputData.RegisterKeyUp(event.key, event.timeStamp);
        });
    }
    else{
        console.error(`Could not find input element(id="${retypeInputId}")`);
    }
}

function StartListening(){
    currentKeyboardInputData = new KeyboardInputData(currentUser, currentPhrase);
}

function StopListening(){
    if(!currentKeyboardInputData) return;
    console.log(currentKeyboardInputData.GetAsSerializableObject());
}

function ResetPhraseInput(){
    const phraseInputElement = document.getElementById(retypeInputId);
    if(phraseInputElement){
        phraseInputElement.value = "";
    }
    else{
        console.error(`Could not find input element(id="${retypeInputId}")`);
    }
}

function Submit(){
    ResetPhraseInput();
    SetNewPhrase();
    StopListening();
    StartListening();
}