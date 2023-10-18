import KeyboardInputData from "./KeyboardInputData.js";
import PhraseInputController from "./PhraseInputController.js";
import PhraseController from "./PhraseController.js";

const phraseToRetypeId = "phrase-to-retype";
const randomPhraseButton = "random-phrase-button";
const retypeInputId = "phrase-intput";
const retypeInputhelperId = "phrase-intput-help";
const submitButtonId = "submit-button";
const cancelButtonId = "cancel-button";


let phraseInputCotroller;
let phraseController;

let currentKeyboardInputData;
let currentPhrase;
let currentUser;

let typingStarted = false;

window.onload = Main;

function Main(){
    phraseController = new PhraseController(phraseToRetypeId, randomPhraseButton);
    phraseInputCotroller = new PhraseInputController(retypeInputId, retypeInputhelperId, submitButtonId, cancelButtonId);

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

    Submit();
}

function StartListening(){
    currentKeyboardInputData = new KeyboardInputData(currentUser, currentPhrase);
}

function StopListening(){
    if(!currentKeyboardInputData) return;
    console.log(currentKeyboardInputData.GetAsSerializableObject());
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
    Clear();
}

function Cancel(){
    Clear();
}

function Pause(){
    if(!typingStarted) return;
    phraseInputCotroller.DisablePhraseInput();
}