import { GetElementById, GetRandomInteger } from "./Utils.js";

class PhraseController
{
    static examplePhrases = [
        "Stop waiting for exceptional things to just happen.",
        "You're good at English when you know the difference between a man eating chicken and a man-eating chicken.",
        "Written warnings in instruction manuals are worthless since rabbits can't read.",
    ];

    static GetRandomPhrase(){
        return this.examplePhrases[GetRandomInteger(0, this.examplePhrases.length)];
    }

    #phraseElement;
    #randomButton;

    OnRandomClicked = () => {};
    OnChange = () => {};

    constructor(phraseId, randomButtonId){
        this.#BindElements(phraseId, randomButtonId);
        this.#AddListeners();
    }

    SetPhrase(phrase){
        this.#phraseElement.value = phrase;
    }

    GetPhrase(){
        return this.#phraseElement.value;
    }

    DisablePhrase(){
        this.#phraseElement.setAttribute("disabled", true);
        this.#randomButton.setAttribute("disabled", true);
    }

    EnablePhrase(){
        this.#phraseElement.removeAttribute("disabled");
        this.#randomButton.removeAttribute("disabled");
    }


    #AddListeners(){
        this.#phraseElement.addEventListener("change", (event) => {this.OnChange(event);});
        this.#randomButton.addEventListener("click", (event) => {this.OnRandomClicked(event);});
    }

    #BindElements(phraseId, randomButtonId){
        this.#phraseElement = GetElementById(phraseId);
        this.#randomButton = GetElementById(randomButtonId);
    }

};

export default PhraseController;