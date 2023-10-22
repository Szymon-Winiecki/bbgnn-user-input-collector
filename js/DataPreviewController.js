import { GetElementById } from "./Utils.js";

class DataPreviewCotroller
{
    #dataPreviewSection;
    #rawPreviewPanel;
    #graphPreviewPanel;
    #rawTab;
    #graphTab;

    OnRawTabClicked = (event) => {};
    OnGraphTabClicked = (event) => {};

    constructor(dataPreviewSectionId, rawPreviewPanelId, graphPreviewPanelId, rawTabId, graphTabId){
        this.#BindElements(dataPreviewSectionId, rawPreviewPanelId, graphPreviewPanelId, rawTabId, graphTabId);
        this.#AddListeners();
    }

    ShowPreviewSection(){
        this.#ShowElement(this.#dataPreviewSection);
    }

    HidePreviewSection(){
        this.#HideElement(this.#dataPreviewSection);
    }

    ChangeTabToRaw(){
        this.#HideElement(this.#graphPreviewPanel);
        this.#ShowElement(this.#rawPreviewPanel);
        this.#graphTab.classList.remove("active");
        this.#rawTab.classList.add("active");
    }
    
    ChangeTabToGraph(){
        this.#HideElement(this.#rawPreviewPanel);
        this.#ShowElement(this.#graphPreviewPanel);
        this.#rawTab.classList.remove("active");
        this.#graphTab.classList.add("active");
    }

    SetRawData(data){
        this.#rawPreviewPanel.innerHTML = '<pre>' + data + '</pre>';
    }

    #ShowElement(element){
        element.classList.remove("d-none");
    }

    #HideElement(element){
        element.classList.add("d-none");
    }

    #BindElements(dataPreviewSectionId, rawPreviewPanelId, graphPreviewPanelId, rawTabId, graphTabId){
        this.#dataPreviewSection = GetElementById(dataPreviewSectionId);
        this.#rawPreviewPanel = GetElementById(rawPreviewPanelId);
        this.#graphPreviewPanel = GetElementById(graphPreviewPanelId);
        this.#rawTab = GetElementById(rawTabId);
        this.#graphTab = GetElementById(graphTabId);
    }

    #AddListeners(){
        this.#rawTab.addEventListener("click", (event) => { this.OnRawTabClicked(event); });
        this.#graphTab.addEventListener("click", (event) => { this.OnGraphTabClicked(event); });
    }

};

export default DataPreviewCotroller;