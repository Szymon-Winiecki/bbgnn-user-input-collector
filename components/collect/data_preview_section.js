import { useState } from "react";
import NavigationTabs from "../navigation_tabs";
import InputDataTable from "../input_data_table";
import InputDataRaw from "../input_data_raw";
import { downloadObjectAsJson } from "../../util/frontendFileDownload";
import InputDataGraph from "../input_data_graph";
import { eventSequenceToMeanGraph, toTorchData } from "../../util/dataRepresentation";

export default function DataPreviewSection({ inputData }) {
    const tabs = [
        { name: "table"},
        { name: "raw data"},
        { name: "graph preview"},
    ];

    const [selectedTab, setSelectedTab] = useState(0);

    function ChangeTab(tab){
        setSelectedTab(tab);
    }


    function handleDownloadRAWFileClick(event){
        const data = inputData.GetAsSerializableObject();
        const filename = `${inputData.GetFinishDate()}_RAW`;
        downloadObjectAsJson(data, filename);
    }

    function handleDownloadSSRGraphFileClick(event){
        const data = eventSequenceToMeanGraph(inputData.GetKeysSequence());
        const filename = `${inputData.GetFinishDate()}_SSR`;
        downloadObjectAsJson(data, filename);
    }

    function handleDownloadTorchGraphFileClick(event){
        const data = toTorchData(eventSequenceToMeanGraph(inputData.GetKeysSequence()), inputData.GetUser());
        const filename = `${inputData.GetFinishDate()}_Torch`;
        downloadObjectAsJson(data, filename);
    }

    if(!inputData){
        return;
    }

    return (
        <div className="col-12 border mt-4" id="data-preview-section">

            <div className="row">
                <div className="col-6 p-4">
                    <div>
                        <span className="fw-bold">user:</span> <span>{inputData.GetUser()}</span>
                    </div>
                    <div>
                        <span className="fw-bold">phrase to retype:</span> <span>{inputData.GetPhrase()}</span>
                    </div>
                </div>

                <div className="col-2 d-flex align-items-center">
                    <button className="btn btn-success col-10 offset-1" onClick={handleDownloadRAWFileClick}><i className="bi bi-file-earmark-arrow-down"></i> RAW</button>
                </div>
                <div className="col-2 d-flex align-items-center">
                    <button className="btn btn-success col-10 offset-1" onClick={handleDownloadSSRGraphFileClick}><i className="bi bi-file-earmark-arrow-down"></i> SSR Graph</button>
                </div>
                <div className="col-2 d-flex align-items-center">
                    <button className="btn btn-success col-10 offset-1" onClick={handleDownloadTorchGraphFileClick}><i className="bi bi-file-earmark-arrow-down"></i> Torch Graph</button>
                </div>
            </div>
            

            <NavigationTabs tabs={tabs} selectedTab={selectedTab} OnChangeTab={ChangeTab} />

            <div className="p-2">
                {selectedTab == 0 && <InputDataTable inputData={ inputData ? inputData.GetKeysSequence() : []} />}
                {selectedTab == 1 && <InputDataRaw inputData={inputData} />}
                {selectedTab == 2 && <InputDataGraph inputData={ inputData ? inputData.GetKeysSequence() : []} />}

            </div>
        </div>
    );
}