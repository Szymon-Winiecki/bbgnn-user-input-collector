import CollectedDataList from '../components/collected_data_list';
import DataPreviewSection from '../components/data_preview_section';
import Layout from '../components/layout';
import ToastSection from '../components/toast_section';
import CollectedDataFilters from '../components/collected_data_filters';

import { useState } from 'react';
import CollectedDataDownloadControls from '../components/collected_data_download_controls';
import { downloadObjectAsJson } from '../util/frontendFileDownload';
import { collectedDataToSSR, collectedDataToTorchData } from '../util/dataRepresentation';
import CollectedDataControls from '../components/collected_data_controls';
import DataUploadControls from '../components/data_upload_controls';

export default function Upload( ) {
    
    const [data, setData] = useState([]);
    const [activeRecord, setActiveRecord] = useState(null);
   
    const [toasts, setToasts] = useState([]);

    /*
        utility functions
    */

    function showToast(title, body, status){
        const toast = {
            title: title,
            body: body,
            status: status,
            time: Date.now()
        }
        setToasts(old => [...old, toast])
    }

    async function removeRecord(index){
        const id = data[index].id;
        const status = await sendRemoveRecordRequest(id);
        if(status == 204){
            setData(old => [...(old.slice(0, index)), ...(old.slice(index + 1, old.length))])
        }
    }


    /*
        event handlers
    */

    function handleCloseToastClick(event, id){
        if(id >= event.length && id < 0) return;

        setToasts(old => [...(old.slice(0, id)), ...(old.slice(id + 1, old.length))]);
    }

    function handleRemoveRecordClick(event, index){

        removeRecord(index);
    }

    async function handleSendAllClick(event){

        if(data.length == 0){
            showToast('No data to send', `There is no any data to send`, 'warning');
            return;
        }

        const status = await sendCollectedData(data);

        if(status == 201){
            showToast('Data sent', `Successfully sent ${data.length} data records`, 'success');
            setData([]);   //TODO: remove only sent data (user can create a new record while request is being processed)
        }
        else{
            showToast('Sending failed', `Can't send the data`, 'danger');
        }
    }

    async function handleUploadFiles(data){
        setData(old => [...old, ...data]);
    }


    /*
        API calls
    */

    async function sendCollectedData(data = []) {
        const url = "http://127.0.0.1:3000/api/collectedData";
        
        try{
            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify(data),
            });
            return response.status;
        }
        catch (e){
            console.log(e);
            return 500;
        }
        
    }

    return (
        <Layout page="upload">
            <div className='row col-12 ms-0'>
                <div className="col-12 border p-4 mb-4">
                    <span className='fs-3'>Browse and manage data stored on the server.</span>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-xl-6">
                    <div className="col-12 border p-4 h-100 d-flex flex-column justify-content-between">
                        <DataUploadControls 
                            OnUploadFiles={handleUploadFiles}/>
                    </div>
                </div>
                <div className="col-12 col-xl-6 mt-4 mt-xl-0">
                    <div className="col-12 border p-4 h-100 d-flex flex-column justify-content-between">
                        <CollectedDataList 
                            collectedData={data} 
                            OnActiveRecordChanged={setActiveRecord}
                            OnRemoveRecordClick={handleRemoveRecordClick} />
                        <CollectedDataControls 
                            OnSendAllClick={handleSendAllClick}/>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <DataPreviewSection inputData={activeRecord} />
                </div>
            </div>
            <ToastSection toasts={toasts} maxToasts={5} OnCloseClick={handleCloseToastClick} />
        </Layout>
    );
}

export async function getServerSideProps(context) {
    return {
      props: {}
    };
  }
