import { GetElementById } from "./Utils.js";

class PhraseInputController
{

    // HTML elements IDs
    #phraseInputElement;
    #submitButtonElement;
    #cancelButtonElement;
    #phraseIntputHelpElement;

    // Event callbacks
    OnSubmit = () => {};
    OnCancel = () => {};
    OnKeyDown = () => {};
    OnKeyUp = () => {};
    OnInputFocus = () => {};
    OnInputBlur = () => {};

    constructor(phraseInputId, phraseInputHelperId, subminButtonId, cancelButtonId){
        this.#BindElements(phraseInputId, phraseInputHelperId, subminButtonId, cancelButtonId);
        this.#AddListeners();
    }

    DisablePhraseInput(){
        this.#phraseInputElement.setAttribute("disabled", true);
    }
    
    EnablePhraseInput(){
        this.#phraseInputElement.removeAttribute("disabled");
    }
    
    ShowHelperText(){
        this.#phraseIntputHelpElement.classList.remove("invisible");
    }
    
    HideHelperText(){
        this.#phraseIntputHelpElement.classList.add("invisible");
    }

    ClearInput(){
        this.#phraseInputElement.value = "";
    }

    #BindElements(phraseInputId, phraseInputHelperId, subminButtonId, cancelButtonId){
        this.#phraseInputElement = GetElementById(phraseInputId);
        this.#submitButtonElement = GetElementById(subminButtonId);
        this.#cancelButtonElement = GetElementById(cancelButtonId);
        this.#phraseIntputHelpElement = GetElementById(phraseInputHelperId);
    }

    #AddListeners(){
        this.#phraseInputElement.addEventListener("focus", (event) => { this.OnInputFocus(event); });
        this.#phraseInputElement.addEventListener("blur", (event) => { this.OnInputBlur(event); });
        this.#phraseInputElement.addEventListener("keydown", (event) => { this.OnKeyDown(event); });
        this.#phraseInputElement.addEventListener("keyup", (event) => { this.OnKeyUp(event); });

        this.#submitButtonElement.addEventListener("click", (event) => { this.OnSubmit(event); });
        this.#cancelButtonElement.addEventListener("click", (event) => { this.OnCancel(event); });
    }
};

export default PhraseInputController;