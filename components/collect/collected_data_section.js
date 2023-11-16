import { useState } from "react";
import CollectedDataRecord from "../collected_data_record";

import { downloadObjectAsJson } from "../../util/frontendFileDownload";


export default function CollectedDataSection({ collectedData, OnActiveRecordChanged, OnSendSelectedClick, OnRemoveSelectedClick, OnSendAllClick, OnRemoveRecordClick }) {

    const [activeRecordIndex, setActiveRecordIndex] = useState(-1);

    function handleRecordClick(event, index){
        setActiveRecordIndex(index);
        OnActiveRecordChanged(index >= 0 ? collectedData[index] : null);
    }

    function handleDownloadFileClick(event, index){
        downloadObjectAsJson(collectedData[index].GetAsSerializableObject(), collectedData[index].GetFinishDate());
    }

    return (
        <div className="col-12 border p-4 h-100 d-flex flex-column justify-content-between">
            <div className="col-10 offset-1 mb-4" id="results-list">

            {collectedData.map( (data, index) => {
                return <CollectedDataRecord 
                        index={index} 
                        username={data.GetUser()} 
                        title={data.GetPhrase()} 
                        time={data.GetFinishDate()} 
                        key={data.GetFinishDate()} 
                        OnClick={handleRecordClick} 
                        OnRemoveClick={OnRemoveRecordClick} 
                        OnDownloadClick={handleDownloadFileClick} />;
            })}
                
            </div>
            <div className="col-10 offset-1 row g-2">
                <div className="col-6">
                    <button className="btn btn-primary col-12" onClick={OnSendSelectedClick}>Send selected</button>
                </div>
                <div className="col-6">
                    <button className="btn btn-danger col-12" onClick={OnRemoveSelectedClick}>remove selected</button>
                </div>
                <div className="col-12">
                    <button className="btn btn-success col-12" onClick={OnSendAllClick}>Send all to server</button>
                </div>

                
            </div>
            
        </div>
  );
}