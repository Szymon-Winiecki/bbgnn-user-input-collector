import CollectedDataList from '../components/collected_data_list';
import DataPreviewSection from '../components/data_preview_section';
import Layout from '../components/layout';
import ToastSection from '../components/toast_section';
import CollectedDataControls from '../components/collected_data_controls';
import DataUploadControls from '../components/data_upload_controls';

import { useState } from 'react';

import * as InputDataAPI from '../util/ClientSideFetches/inputDataAPI'
import { ToastManager } from '../util/ToastManager';
import PaginatedCollectedDataList from '../components/paginated_collected_data_list';

export default function Upload( ) {
    
    const [data, setData] = useState([]);
    const [activeRecord, setActiveRecord] = useState(null);
   
    const [toasts, setToasts] = useState([]);

    const toastManager = new ToastManager(setToasts);

    /*
        event handlers
    */

    function handleCloseToastClick(event, id){
        toastManager.closeToast(id);
    }

    function handleRemoveRecordClick(event, index){
        setData(old => [...(old.slice(0, index)), ...(old.slice(index + 1, old.length))])
    }

    async function handleSendAllClick(event){

        if(data.length == 0){
            toastManager.showToast('No data to send', `There is no any data to send`, 'warning');
            return;
        }

        const response = await InputDataAPI.sendRecords(data);

        if(response.ok){
            toastManager.showToast('Data sent', `Successfully sent ${data.length} data records`, 'success');
            setData([]);   //TODO: remove only sent data (user can create a new record while request is being processed)
        }
        else{
            toastManager.showToast('Sending failed', `Can't send the data`, 'danger');
        }
    }

    async function handleUploadFiles(data){
        setData(old => [...old, ...data]);
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
                        <PaginatedCollectedDataList 
                            data={data}
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
