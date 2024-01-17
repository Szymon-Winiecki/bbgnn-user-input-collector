import CollectedDataList from '../components/collected_data_list';
import DataPreviewSection from '../components/data_preview_section';
import Layout from '../components/layout';
import ToastSection from '../components/toast_section';
import CollectedDataFilters from '../components/collected_data_filters';
import CollectedDataDownloadControls from '../components/collected_data_download_controls';

import { useEffect, useState } from 'react';
import { downloadObjectAsJson } from '../util/frontendFileDownload';
import { collectedDataToSSR, collectedDataToTorchData } from '../util/dataRepresentation';
import * as InputDataAPI from '../util/ClientSideFetches/inputDataAPI'
import { ToastManager } from '../util/ToastManager';
import Pagination from '../components/pagination';
import PaginatedCollectedDataList from '../components/paginated_collected_data_list';

export default function Browse( ) {
    
    const [data, setData] = useState([]);
    const [activeRecord, setActiveRecord] = useState(null);
    const [page, setPage] = useState(1);
    const [recordsOnPage, setRecordsOnPage] = useState(10);
    const [availableRecords, setAvailableRecords] = useState(0);

    const [usernames, setUsernames] = useState([])
   
    const [toasts, setToasts] = useState([]);

    const [filterValues, setFilterValues] = useState({
        sortField: '',
        sortAsc: true,
        users: [],
        maxTypos: -1,
        phrase: '',
        limitRecordsPerUser : -1,
        minCompetitionDataCount: 0,
        minUserDataCount: 0,
        maxTimeDeviationFromUserMean: -1,
    });

    const [query, setQuery] = useState({
        sortField: '',
        sortAsc: true,
        users: [],
        maxTypos: undefined,
        phrase: '',
        limitRecordsPerUser: undefined,
        minCompetitionDataCount: 0,
        minUserDataCount: 0,
        maxTimeDeviationFromUserMean: undefined,
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

    async function getRecords(){

        const fullQuery = {...query, page: page, recordsOnPage: recordsOnPage };
        const response = await InputDataAPI.selectRecords(fullQuery);

        if(response.ok){
            setAvailableRecords(response.body.allRecordsCount);
            setData(response.body.records);
        }
        else{
            toastManager.showToast("Can't fetch data", "Try again later", "danger");
        }
    }

    async function getUsernames(){
        const response = await InputDataAPI.getAllUsernames();

        if(response.ok){
            setUsernames(response.body);
        }
        else{
            toastManager.showToast("Failed to fetch usernames", "Try again later", "danger");
        }
    }


    /*
        event handlers
    */

    function handleCloseToastClick(event, id){
        toastManager.closeToast(id);
    }

    async function handleApplyFilters(event){
        getRecords();
    }

    function handleRemoveRecordClick(event, index){

        removeRecord(index);
    }

    // all == true - download all; all == false - download selected
    async function handleDownload(all, format){

        const fullQuery = {...query, page: 1, recordsOnPage: availableRecords }
        const response = await InputDataAPI.selectRecords(fullQuery)

        if(!response.ok){
            toastManager.showToast("Download failed", "Try again later", "danger");
            return;
        }

        const data = response.body.records;

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
        setFilterValues(old => {
            const newq = { ...old };
            newq.sortField = event.target.value;
            return newq;
        })

        setQuery(old => {
            const newq = { ...old };
            newq.sortField = event.target.value;
            return newq;
        })
    }

    function handleSortOrderChange(event){
        setFilterValues(old => {
            const newq = { ...old };
            newq.sortAsc = (event.target.value === 'asc');
            return newq;
        })

        setQuery(old => {
            const newq = { ...old };
            newq.sortAsc = (event.target.value === 'asc');
            return newq;
        })
    }

    function handleUsersChange(event){
        setFilterValues(old => {
            const newq = { ...old };
            newq.users = Array.from(event.target.selectedOptions).map(o => o.value);
            return newq;
        })

        setQuery(old => {
            const newq = { ...old };
            newq.users = Array.from(event.target.selectedOptions).map(o => o.value);
            return newq;
        })
    }

    function handlePhraseChange(event){
        setFilterValues(old => {
            const newq = { ...old };
            newq.phrase = event.target.value;
            return newq;
        })

        setQuery(old => {
            const newq = { ...old };
            newq.phrase = event.target.value;
            return newq;
        })
    }

    function handleRecordsPerUserLimitChange(event){
        setFilterValues(old => {
            const newq = { ...old };
            newq.limitRecordsPerUser = event.target.value;
            return newq;
        })

        setQuery(old => {
            const newq = { ...old };
            if(event.target.value == -1)
                newq.limitRecordsPerUser = undefined;
            else
                newq.limitRecordsPerUser = event.target.value;
            return newq;
        })
    }

    function handleTyposChange(event){
        setFilterValues(old => {
            const newq = { ...old };
            newq.maxTypos = event.target.value;
            return newq;
        })

        setQuery(old => {
            const newq = { ...old };
            if(event.target.value == -1)
                newq.maxTypos = undefined;
            else
                newq.maxTypos = event.target.value;
            return newq;
        })
    }

    function handleMinUserDataCountChange(event){
        setFilterValues(old => {
            const newq = { ...old };
            newq.minUserDataCount = event.target.value;
            return newq;
        })

        setQuery(old => {
            const newq = { ...old };
            newq.minUserDataCount = event.target.value;
            return newq;
        })
    }

    function handleMinCompetitionDataCountChange(event){
        setFilterValues(old => {
            const newq = { ...old };
            newq.minCompetitionDataCount = event.target.value;
            return newq;
        })

        setQuery(old => {
            const newq = { ...old };
            newq.minCompetitionDataCount = event.target.value;
            return newq;
        })
    }

    function handleMaxTimeDeviationChange(event){
        setFilterValues(old => {
            const newq = { ...old };
            newq.maxTimeDeviationFromUserMean = event.target.value;
            return newq;
        })

        setQuery(old => {
            const newq = { ...old };
            if(event.target.value == -1)
                newq.maxTimeDeviationFromUserMean = undefined;
            else
                newq.maxTimeDeviationFromUserMean = event.target.value / 100;
            return newq;
        })
    }

    function handleChangePage(page){
        setPage(page);
    }

    function handleChangeRecordsOnPage(event){
        setRecordsOnPage(event.target.value);
    }

    useEffect(() => {
        getUsernames();
    }, [])

    useEffect(() => {
        getRecords();
    }, [page, recordsOnPage]);

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
                            allUsers={usernames}
                            phrases={["Ala ma kota", "Jola ma jeża"]}
                            recordsPerUserLimit={filterValues.limitRecordsPerUser}
                            OnRecordsPerUserLimitChange={handleRecordsPerUserLimitChange}
                            typos={filterValues.maxTypos}
                            OnTyposChange={handleTyposChange}
                            minUserDataCount={filterValues.minUserDataCount}
                            OnMinUserDataCountChange={handleMinUserDataCountChange}
                            minCompetitionDataCount={filterValues.minCompetitionDataCount}
                            OnMinCompetitionrDataCountChange={handleMinCompetitionDataCountChange}
                            maxTimeDeviation={filterValues.maxTimeDeviationFromUserMean}
                            OnMaxTimeDeviationChange={handleMaxTimeDeviationChange}
                            OnApplyClick={handleApplyFilters} 
                            sortField={filterValues.sortField}
                            OnSortFieldChange={handleSortFieldChange}
                            sortOrder={filterValues.sortAsc ? 'asc' : 'desc'}
                            OnSortOrderChange={handleSortOrderChange}
                            users={filterValues.users}
                            OnUsersChange={handleUsersChange}
                            phrase={filterValues.phrase}
                            OnPhraseChange={handlePhraseChange} />
                    </div>
                </div>
                <div className="col-12 col-xl-6 mt-4 mt-xl-0">
                    

                    <div className="col-12 border p-4 h-100 d-flex flex-column justify-content-between">
                        <PaginatedCollectedDataList
                            data={data} 
                            force_page={page}
                            force_availableRecordsCount={availableRecords}
                            force_recordsOnPage={recordsOnPage}
                            OnActiveRecordChanged={setActiveRecord}
                            OnRemoveRecordClick={handleRemoveRecordClick}
                            OnPageChange={handleChangePage}
                            OnRecordsOnPageChange={handleChangeRecordsOnPage} />
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
