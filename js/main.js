import KeyboardInputData from "./KeyboardInputData.js";
import PhraseInputController from "./PhraseInputController.js";
import PhraseController from "./PhraseController.js";
import ListController from "./ListController.js";
import {TimestampToTimeString} from "./Utils.js";

const phraseToRetypeId = "phrase-to-retype";
const randomPhraseButton = "random-phrase-button";
const retypeInputId = "phrase-intput";
const retypeInputhelperId = "phrase-intput-help";
const submitButtonId = "submit-button";
const cancelButtonId = "cancel-button";
const resultsListId = "results-list";
const resultsListRowTemplateId = "results-list-element-template";

let phraseInputCotroller;
let phraseController;
let listController;

let keyboardInputData = []

let currentKeyboardInputData;
let currentPhrase;
let currentUser;

let typingStarted = false;

window.onload = Main;

function Main(){
    phraseController = new PhraseController(phraseToRetypeId, randomPhraseButton);
    phraseInputCotroller = new PhraseInputController(retypeInputId, retypeInputhelperId, submitButtonId, cancelButtonId);
    listController = new ListController(resultsListRowTemplateId, resultsListId);

    phraseController.OnRandomClicked = () => {
        phraseController.SetPhrase(PhraseController.GetRandomPhrase());
    }

    phraseInputCotroller.OnSubmit = Submit;
    phraseInputCotroller.OnCancel = Cancel;
    phraseInputCotroller.OnInputFocus = phraseInputCotroller.ShowHelperText;
    phraseInputCotroller.OnInputBlur = Pause;

    phraseInputCotroller.OnKeyDown = (event) => {
        if(!typingStarted){
            typingStarted = true;
            Start();
        }
        currentKeyboardInputData.RegisterKeyDown(event.key, event.timeStamp);
    };
    phraseInputCotroller.OnKeyUp = (event) => {
        currentKeyboardInputData.RegisterKeyUp(event.key, event.timeStamp);
    };

    listController.OnRowClicked = (event, id) => {
        id = ListController.ExtractIdFromIdAttr(id);
        console.log(keyboardInputData[id]);
    }

    listController.OnRemoveButtonClicked = (event, id) => {
        id = ListController.ExtractIdFromIdAttr(id);
        RemoveInputData(id);
    }

    Submit();
}

function StartListening(){
    currentKeyboardInputData = new KeyboardInputData(currentUser, currentPhrase);
}

function StopListening(){
    if(!currentKeyboardInputData) return;
    console.log(currentKeyboardInputData.GetAsSerializableObject());
}

function SaveCurrentInputData(){
    if(!currentKeyboardInputData) return;
    currentKeyboardInputData.SetFinishTime(Date.now());
    keyboardInputData.push(currentKeyboardInputData);
    listController.AddElement(ListController.GenerateIdAttr(keyboardInputData.length - 1), currentKeyboardInputData.GetPhrase(), TimestampToTimeString(currentKeyboardInputData.GetFinishTime()));
}

function RemoveInputData(id){
    listController.RemoveElement(ListController.GenerateIdAttr(id));
    keyboardInputData.splice(id, 1);
}

function Start(){
    phraseController.DisablePhrase.bind(phraseController)();
    currentPhrase = phraseController.GetPhrase();
    // currentUser = userController.GetUser();
    StartListening();
}

function Clear(){
    phraseInputCotroller.HideHelperText();
    phraseInputCotroller.ClearInput();
    phraseInputCotroller.EnablePhraseInput();
    phraseController.EnablePhrase.bind(phraseController)();

    typingStarted = false;
}

function Submit(){
    StopListening();
    SaveCurrentInputData();
    Clear();
}

function Cancel(){
    Clear();
}

function Pause(){
    if(!typingStarted) return;
    phraseInputCotroller.DisablePhraseInput();
}