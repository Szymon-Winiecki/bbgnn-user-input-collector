import { GetElementById } from "./Utils.js";

class ListController
{
    static #maxTitleLength = 32;

    static GenerateIdAttr(id){
        return `result-list-row-${id}`;
    }

    static ExtractIdFromIdAttr(idAttr){
        return parseInt(idAttr.substring(idAttr.lastIndexOf("-") + 1));
    }

    #resultsListElementTemplate;
    #resultsList;

    OnRowClicked = (event, id) => {};
    OnRemoveButtonClicked = (event, id) => {};

    constructor(resultsListElementTemplateId, resultsListId){
        this.#BindElements(resultsListElementTemplateId, resultsListId);
    }

    AddElement(id, title, timestamp){
        if(title.length > ListController.#maxTitleLength){
            title = title.substring(0, ListController.#maxTitleLength - 3) + "...";
        }
        let row = this.#CreateListElement(id, title, timestamp);
        this.#resultsList.appendChild(row);
        
        row.addEventListener("click", (event) => { this.OnRowClicked(event, row.id); });
        row.querySelector(".remove-row").addEventListener("click", (event) => { this.OnRemoveButtonClicked(event, row.id); });
    }

    RemoveElement(id){
        GetElementById(id).remove();
    }

    #BindElements(resultsListElementTemplateId, resultsListId){
        this.#resultsListElementTemplate = GetElementById(resultsListElementTemplateId);
        this.#resultsList = GetElementById(resultsListId);
    }

    #CreateListElement(id, title, timestamp){
        let element = this.#resultsListElementTemplate.content.cloneNode(true);

        element = element.querySelector(".results-list-element");
        element.id = id;
        element.querySelector(".list-element-title").innerText = title;
        element.querySelector(".list-element-time").innerText = timestamp;

        return element;
    }
};

export default ListController;