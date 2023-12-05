import { useState } from "react";
import CollectedDataList from "./collected_data_list";
import Pagination from "./pagination";
import { recordsOnPage as paginator } from "../util/utilityHelper";


export default function PaginatedCollectedDataList({ data, force_availableRecordsCount, force_page, force_recordsOnPage, OnActiveRecordChanged, OnRemoveRecordClick, OnPageChange, OnRecordsOnPageChange }) {

    const [page, setPage] = useState(1);
    const [recordsOnPage, setRecordsOnpage] = useState(10);

    function getAvailableRecords(){
        return force_availableRecordsCount ?? data.length;
    }

    function getPagesCount(){
        return Math.ceil(getAvailableRecords() / getRecordsOnPage());
    }

    function getPage(){
        return force_page ?? page;
    }

    function getRecordsOnPage(){
        return parseInt(force_recordsOnPage ?? recordsOnPage);
    }
    
    function getRecords(){
        if(force_availableRecordsCount){
            return data;
        }
        else{
            const pagination = paginator(getAvailableRecords(), getPage(), getRecordsOnPage())
            return data.slice(pagination.from, pagination.to);
        }
    }

    function handleChangeRecordsOnPage(event){
        if(OnRecordsOnPageChange){
            OnRecordsOnPageChange(event);
        }
        if(!force_recordsOnPage){
            setRecordsOnpage(parseInt(event.target.value));
        }
    }

    function handleChangePage(newPage){
        if(OnPageChange){
            OnPageChange(newPage);
        }
        if(!force_page){
            setPage(newPage);
        }
    }

    return (
       <>
        <div className='col-10 offset-1 d-flex justify-content-between align-items-center mb-3'>
            <div className="input-group w-50 align-items-center">
                <label className="input-group-text">records on page</label>
                <input type="number" className="form-control" min={0} value={getRecordsOnPage()} onChange={handleChangeRecordsOnPage} />
            </div>
            <div>
                records <span className='mx-1 fw-bold'> {Math.min((getPage() - 1) * getRecordsOnPage() + 1, getAvailableRecords())} - {Math.min(getPage() * getRecordsOnPage(), getAvailableRecords())}</span> of <span className='mx-1 fw-bold'>{getAvailableRecords()}</span>
            </div>
        </div>
        <CollectedDataList 
            collectedData={getRecords()} 
            OnActiveRecordChanged={OnActiveRecordChanged}
            OnRemoveRecordClick={OnRemoveRecordClick} />
        <div className={`col-11 d-flex justify-content-end ${getPagesCount() <= 1 && 'd-none'}`}>
            <Pagination 
                pagesCount={getPagesCount()}
                currentPage={getPage()}
                OnChangePage={handleChangePage}/>
        </div>
       </>
  );
}