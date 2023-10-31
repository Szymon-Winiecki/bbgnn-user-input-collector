import { useState } from "react";
import NavigationTabs from "../navigation_tabs";
import InputDataTable from "../input_data_table";
import InputDataRaw from "../input_data_raw";
import { downloadObjectAsJson } from "../../util/frontendFileDownload";
import InputDataGraph from "../input_data_graph";

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


    function handleDownloadFileClick(event){
        downloadObjectAsJson(inputData.GetAsSerializableObject(), inputData.GetFinishDate());
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

                <div className="col-6 d-flex align-items-center">
                    <button className="btn btn-success" onClick={handleDownloadFileClick}><i className="bi bi-file-earmark-arrow-down"></i> Download JSON</button>
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