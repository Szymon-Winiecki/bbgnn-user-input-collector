import { useState } from "react";
import CollectedDataRecord from "./collected_data_record";

import { downloadObjectAsJson } from "../util/frontendFileDownload";


export default function CollectedDataList({ collectedData, OnActiveRecordChanged, OnRemoveRecordClick }) {

    const [activeRecordIndex, setActiveRecordIndex] = useState(-1);

    function handleRecordClick(event, index){
        setActiveRecordIndex(index);
        OnActiveRecordChanged(index >= 0 ? collectedData[index] : null);
    }

    function handleDownloadFileClick(event, index){
        downloadObjectAsJson(collectedData[index], collectedData[index].finishDate);
    }

    return (
        <div className="col-10 offset-1 mb-4" id="results-list">

            {collectedData.map( (data, index) => {
                return <CollectedDataRecord 
                        index={index} 
                        username={data.user} 
                        title={data.phrase} 
                        time={data.finishDate} 
                        key={`${data.finishDate}_${data.id ?? ''}`} 
                        OnClick={handleRecordClick} 
                        OnRemoveClick={OnRemoveRecordClick} 
                        OnDownloadClick={handleDownloadFileClick} />;
            })}
            
        </div>
  );
}