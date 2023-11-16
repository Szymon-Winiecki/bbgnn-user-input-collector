import CollectedDataList from '../components/collected_data_list';
import DataPreviewSection from '../components/data_preview_section';
import Layout from '../components/layout';
import ToastSection from '../components/toast_section';
import CollectedDataFilters from '../components/collected_data_filters';

import { useState } from 'react';

export default function Browse( ) {
    
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


    /*
        event handlers
    */

    function handleCloseToastClick(event, id){
        if(id >= event.length && id < 0) return;

        setToasts(old => [...(old.slice(0, id)), ...(old.slice(id + 1, old.length))]);
    }

    async function handleApplyFilters(event){
        const fetched = await getAllRecords();
        setData(fetched);
    }

    /*
        API calls
    */

    async function getAllRecords() {
        const url = "http://127.0.0.1:3000/api/collectedData";

        try{
            const response = await fetch(url, {
                method: "GET",
                mode: "cors",
                cache: "no-cache",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
            });

            if(response.ok){
                return response.json();
            }
            else{
                showToast("Can't fetch data", "Try again later", "danger")
                return [];
            }
        }
        catch (e){
            console.log(e);
            showToast("Can't fetch data", "Try again later", "danger");
            return [];
        }
        
    }

    return (
        <Layout>
            <div className='row col-12 ms-0'>
                <div className="col-12 border p-4 mb-4">
                    <span className='fs-3'>Browse and manage data stored on the server.</span>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-xl-6">
                    <div className="col-12 border p-4 h-100 d-flex flex-column justify-content-between">
                        <CollectedDataFilters 
                           OnApplyClick={handleApplyFilters} />
                    </div>
                </div>
                <div className="col-12 col-xl-6 mt-4 mt-xl-0">
                    <div className="col-12 border p-4 h-100 d-flex flex-column justify-content-between">
                        <CollectedDataList 
                            collectedData={data} 
                            OnActiveRecordChanged={setActiveRecord} />
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
