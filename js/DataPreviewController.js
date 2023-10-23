import { GetElementById } from "./Utils.js";

class DataPreviewCotroller
{
    #tablePreviewRowTemplate;

    #dataPreviewSection;
    #tablePreviewPanel;
    #rawPreviewPanel;
    #graphPreviewPanel;
    #tableTab;
    #rawTab;
    #graphTab;

    #previewTable;


    OnTableTabClicked = (event) => {};
    OnRawTabClicked = (event) => {};
    OnGraphTabClicked = (event) => {};

    constructor(tablePreviewRowTemplateId, dataPreviewSectionId, tablePreviewPanelId,  rawPreviewPanelId, graphPreviewPanelId, tableTabId, rawTabId, graphTabId, previewTableId){
        this.#BindElements(tablePreviewRowTemplateId, dataPreviewSectionId, tablePreviewPanelId, rawPreviewPanelId, graphPreviewPanelId, tableTabId, rawTabId, graphTabId, previewTableId);
        this.#AddListeners();
    }

    ShowPreviewSection(){
        this.#ShowElement(this.#dataPreviewSection);
    }

    HidePreviewSection(){
        this.#HideElement(this.#dataPreviewSection);
    }

    ChangetabToTable(){
        this.#HideAllPanels();
        this.#ShowElement(this.#tablePreviewPanel);

        this.#DeactivateAllTabs();
        this.#tableTab.classList.add("active");
    }

    ChangeTabToRaw(){
        this.#HideAllPanels();
        this.#ShowElement(this.#rawPreviewPanel);
        
        this.#DeactivateAllTabs();
        this.#rawTab.classList.add("active");
    }
    
    ChangeTabToGraph(){
        this.#HideAllPanels();
        this.#ShowElement(this.#graphPreviewPanel);
        
        this.#DeactivateAllTabs();
        this.#graphTab.classList.add("active");
    }

    SetData(data){
        this.#SetTablePreview(data);
        this.#SetRawPreview(data);
        this.#SetGraphPreview(data);
    }

    #SetTablePreview(data){

        //clear the table
        this.#previewTable.textContent = '';
        

        const username = data.GetUser();
        const finishDate = data.GetFinishDate();
        const sequence = data.GetKeysSequence();

        console.log(sequence);

        sequence.forEach((row, i) => {
            const key = row.key;
            const keyDown = row.keyDownTime ? parseInt(row.keyDownTime) : "-";
            const keyUp = row.keyUpTime ? parseInt(row.keyUpTime) : "-";
            const pressingTime = keyUp ? parseInt(keyUp- keyDown) : '-';
            const element = this.#CreateRow(i, key, keyDown, keyUp, pressingTime);

            this.#previewTable.appendChild(element);
        });
    }

    #SetRawPreview(data){
        this.#rawPreviewPanel.innerHTML = '<pre>' + JSON.stringify(data.GetAsSerializableObject(),null, 3) + '</pre>';
    }

    #SetGraphPreview(data){
        //TODO
    }

    #ShowElement(element){
        element.classList.remove("d-none");
    }

    #HideElement(element){
        element.classList.add("d-none");
    }

    #HideAllPanels(){
        this.#HideElement(this.#tablePreviewPanel);
        this.#HideElement(this.#rawPreviewPanel);
        this.#HideElement(this.#graphPreviewPanel);
    }

    #DeactivateAllTabs(){
        this.#tableTab.classList.remove("active");
        this.#rawTab.classList.remove("active");
        this.#graphTab.classList.remove("active");
    }

    #CreateRow(no, key, keyDown, keyUp, pressingTime){
        let element = this.#tablePreviewRowTemplate.content.cloneNode(true);

        element = element.querySelector("tr");
        const fields = element.querySelectorAll("td");
        fields[0].innerText = no;
        fields[1].innerText = key;
        fields[2].innerText = keyDown;
        fields[3].innerText = keyUp;
        fields[4].innerText = pressingTime;

        return element;
    }

    #BindElements(tablePreviewRowTemplateId, dataPreviewSectionId, tablePreviewPanelId, rawPreviewPanelId, graphPreviewPanelId, tableTabId, rawTabId, graphTabId, previewTableId){
        this.#tablePreviewRowTemplate  = GetElementById(tablePreviewRowTemplateId);
        this.#dataPreviewSection = GetElementById(dataPreviewSectionId);
        this.#tablePreviewPanel = GetElementById(tablePreviewPanelId);
        this.#rawPreviewPanel = GetElementById(rawPreviewPanelId);
        this.#graphPreviewPanel = GetElementById(graphPreviewPanelId);
        this.#tableTab = GetElementById(tableTabId);
        this.#rawTab = GetElementById(rawTabId);
        this.#graphTab = GetElementById(graphTabId);
        this.#previewTable = GetElementById(previewTableId);
    }

    #AddListeners(){
        this.#tableTab.addEventListener("click", (event) => { this.OnTableTabClicked(event); });
        this.#rawTab.addEventListener("click", (event) => { this.OnRawTabClicked(event); });
        this.#graphTab.addEventListener("click", (event) => { this.OnGraphTabClicked(event); });
    }

};

export default DataPreviewCotroller;