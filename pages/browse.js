import CollectedDataList from '../components/collected_data_list';
import DataPreviewSection from '../components/data_preview_section';
import Layout from '../components/layout';
import ToastSection from '../components/toast_section';
import CollectedDataFilters from '../components/collected_data_filters';
import CollectedDataDownloadControls from '../components/collected_data_download_controls';

import { useState } from 'react';
import { downloadObjectAsJson } from '../util/frontendFileDownload';
import { collectedDataToSSR, collectedDataToTorchData } from '../util/dataRepresentation';
import * as InputDataAPI from '../util/ClientSideFetches/inputDataAPI'
import { ToastManager } from '../util/ToastManager';

export default function Browse( ) {
    
    const [data, setData] = useState([]);
    const [activeRecord, setActiveRecord] = useState(null);
   
    const [toasts, setToasts] = useState([]);

    const [query, setQuery] = useState({
        sortField: '',
        sortAsc: true,
        users: [],
        phrase: ''
    });

    const toastManager = new ToastManager(setToasts);

    /*
        utility functions
    */

    async function removeRecord(index){
        const id = data[index].id;
        const response = await InputDataAPI.removeRecord(id);
        if(response.ok){
            toastManager.showToast("Record removed", "Record successfully removed", "success");
            setData(old => [...(old.slice(0, index)), ...(old.slice(index + 1, old.length))]);
        }
        else{
            toastManager.showToast("Can't remove record", "Try again later", "danger");
        }
    }


    /*
        event handlers
    */

    function handleCloseToastClick(event, id){
        toastManager.closeToast(id);
    }

    async function handleApplyFilters(event){
        const response = await InputDataAPI.selectRecords(query)

        if(response.ok){
            setData(response.body.records);
        }
        else{
            toastManager.showToast("Can't fetch data", "Try again later", "danger");
        }
    }

    function handleRemoveRecordClick(event, index){

        removeRecord(index);
    }

    // all == true - download all; all == false - download selected
    function handleDownload(all, format){
        let dataToDownload;
        let filename;
        if(all){
            if(format == "torch"){
                dataToDownload = collectedDataToTorchData(data);
                filename = `data_torch_${Date.now()}`;
            }
            else if(format == "ssr"){
                dataToDownload = collectedDataToSSR(data);
                filename = `data_ssr_${Date.now()}`;
            }
            else if(format == "raw"){
                dataToDownload = data;
                filename = `data_raw_${Date.now()}`;
            }
            
        }
        
        if(dataToDownload && filename){
            downloadObjectAsJson(dataToDownload, filename);
        }
        
    }

    function handleSortFieldChange(event){
        setQuery(old => {
            const newq = { ...old };
            newq.sortField = event.target.value;
            return newq;
        })
    }

    function handleSortOrderChange(event){
        setQuery(old => {
            const newq = { ...old };
            newq.sortAsc = (event.target.value === 'asc');
            return newq;
        })
    }

    function handleUsersChange(event){
        setQuery(old => {
            const newq = { ...old };
            newq.users = Array.from(event.target.selectedOptions).map(o => o.value);
            return newq;
        })
        console.log(Array.from(event.target.selectedOptions).map(o => o.value));
    }

    function handlePhraseChange(event){
        setQuery(old => {
            const newq = { ...old };
            newq.phrase = event.target.value;
            return newq;
        })
    }

    return (
        <Layout page="browse">
            <div className='row col-12 ms-0'>
                <div className="col-12 border p-4 mb-4">
                    <span className='fs-3'>Browse and manage data stored on the server.</span>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-xl-6">
                    <div className="col-12 border p-4 h-100 d-flex flex-column justify-content-between">
                        <CollectedDataFilters 
                            allUsers={["Szymon", "Test"]}
                            phrases={["Ala ma kota", "Jola ma jeża"]}
                            OnApplyClick={handleApplyFilters} 
                            sortField={query.sortField}
                            OnSortFieldChange={handleSortFieldChange}
                            sortOrder={query.sortAsc ? 'asc' : 'desc'}
                            OnSortOrderChange={handleSortOrderChange}
                            users={query.users}
                            OnUsersChange={handleUsersChange}
                            phrase={query.phrase}
                            OnPhraseChange={handlePhraseChange} />
                    </div>
                </div>
                <div className="col-12 col-xl-6 mt-4 mt-xl-0">
                    <div className="col-12 border p-4 h-100 d-flex flex-column justify-content-between">
                        <CollectedDataList 
                            collectedData={data} 
                            OnActiveRecordChanged={setActiveRecord}
                            OnRemoveRecordClick={handleRemoveRecordClick} />
                        <CollectedDataDownloadControls 
                            OnDownload={handleDownload}/>
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
