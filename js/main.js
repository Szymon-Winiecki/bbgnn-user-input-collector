import KeyboardInputData from "./KeyboardInputData.js";

const phrases = [
    "Stop waiting for exceptional things to just happen.",
    "You're good at English when you know the difference between a man eating chicken and a man-eating chicken.",
    "Written warnings in instruction manuals are worthless since rabbits can't read.",
];

const phraseToRetypeId = "phrase-to-retype";
const retypeInputId = "phrase-intput";
const retypeInputhelperId = "phrase-intput-help";
const submitButtonId = "submit-button";
const cancelButtonId = "cancel-button";

let phraseInputElement;
let submitButtonElement;
let cancelButtonElement;
let phraseIntputHelpElement;

let currentKeyboardInputData;
let currentPhrase;
let currentUser;

window.onload = Main;

function Main(){
    GetElements();
    AddPhraseInputListeners();

    submitButtonElement.addEventListener('click', Submit);
    cancelButtonElement.addEventListener('click', Cancel);

    Submit();
}

function GetElements(){
    phraseInputElement = document.getElementById(retypeInputId);
    if(!phraseInputElement){
        console.error(`Could not find input element(id="${retypeInputId}")`);
        console.error(`Could not find input element(id="${retypeInputId}")`);
    }

    submitButtonElement = document.getElementById(submitButtonId);
    if(!submitButtonElement){
        console.error(`Could not find submit button element(id="${submitButtonId}")`);
    }

    cancelButtonElement = document.getElementById(cancelButtonId);
    if(!cancelButtonElement){
        console.error(`Could not find cancel button element(id="${cancelButtonId}")`);
    }

    phraseIntputHelpElement = document.getElementById(retypeInputhelperId);
    if(!phraseIntputHelpElement){
        console.error(`Could not find help text element(id="${retypeInputhelperId}")`);
    }
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

function AddPhraseInputListeners(){
    phraseInputElement.addEventListener("focus", ShowHelperText);
    phraseInputElement.addEventListener("blur", Pause);
    phraseInputElement.addEventListener("keydown", (event) => {
        currentKeyboardInputData.RegisterKeyDown(event.key, event.timeStamp);
    });
    phraseInputElement.addEventListener("keyup", (event) => {
        currentKeyboardInputData.RegisterKeyUp(event.key, event.timeStamp);
    });
}

function StartListening(){
    currentKeyboardInputData = new KeyboardInputData(currentUser, currentPhrase);
}

function StopListening(){
    if(!currentKeyboardInputData) return;
    console.log(currentKeyboardInputData.GetAsSerializableObject());
}

function ResetPhraseInput(){
    phraseInputElement.value = "";
}

function DisablePhraseInput(){
    phraseInputElement.setAttribute("disabled", true);
}

function EnablePhraseInput(){
    phraseInputElement.removeAttribute("disabled");
}

function ShowHelperText(){
    phraseIntputHelpElement.classList.remove("invisible");
}

function HideHelperText(){
    phraseIntputHelpElement.classList.add("invisible");
}

function Submit(){
    DisablePhraseInput();
    HideHelperText();
    ResetPhraseInput();
    SetNewPhrase();
    StopListening();
    StartListening();
    EnablePhraseInput();
}

function Cancel(){
    ResetPhraseInput();
    SetNewPhrase();
    StartListening();
}

function Pause(){
    DisablePhraseInput();
}