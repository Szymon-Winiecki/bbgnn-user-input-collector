import { useEffect, useState } from "react";
import { deserializeInputData } from "../util/InputDataDeserialization";

export default function DataUploadControls({ OnUploadFiles }) {

    const [filesStatus, setFilesStatus] = useState([]);
    const [filesToReadCount, setFilesToReadCount] = useState(0);
    const [filesReadCount, setFilesReadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState([]);

    function onFileRead(event, filename, filesize){
        const content = event.target.result;

        const info = deserializeInputData(content);

        let icon = '?';
        if(info.found_obj_count == 0){
            icon = '∅';
        }
        else if (info.incorrect_obj_count == 0){
            icon = '✓';
        }
        else if(info.correct_obj_count == 0){
            icon = 'ⓧ';
        }
        else{
            icon = '⚠';
        }

        const status = {
            icon: icon,
            filename: filename,
            filesize: filesize,
            found_obj_count: info.found_obj_count,
            correct_obj_count: info.correct_obj_count,
            incorrect_obj_count: info.incorrect_obj_count,
        }

        setFilesReadCount(old => old + 1);
        setFilesStatus(old => [...old, status]);
        setData(old => [...old, ...(info.correct_obj)])

        
    }

    useEffect(() => {
        if(filesReadCount == filesToReadCount){
            setLoading(false);
        }
    }, [filesReadCount])

    function handleChangeFiles(event){
        setLoading(true);

        setData([]);
        setFilesStatus([]);
        setFilesToReadCount(event.target.files.length);
        setFilesReadCount(0);

        for(let i = 0; i < event.target.files.length; ++i){
            const reader = new FileReader();
            reader.addEventListener('loadend', e => onFileRead(e, event.target.files[i].name, event.target.files[i].size));
            reader.readAsText(event.target.files[i]);
        }
    }

    function handleOKClick(event){
        OnUploadFiles(data);
    }

    return (
        <div className="col-10 offset-1 row g-2">
            <div className="input-group mb-3">
                <input type="file" className="form-control" multiple onChange={handleChangeFiles} disabled={loading}/>
            </div>
            <div className="d-flex my-3">
                <div className={`spinner-border ${loading ? 'd-auto' : 'd-none'}`} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className={`${loading ? 'd-none' : 'd-auto'}`} role="status">
                    <span className="">✓</span>
                </div>
                <div className="ms-3">
                    <span>files read: </span> <span className="fw-bold">{filesReadCount} / {filesToReadCount}</span>
                </div>
                <div className={`ms-3 ${loading ? 'd-none' : 'd-auto'}`}>
                    <span>valid objects found: </span> <span className="fw-bold">{filesStatus.reduce((prev, curr) => prev + curr.correct_obj_count, 0)}</span>
                </div>
            </div>
            <div>
                <div className="col-12 d-flex fst-italic mb-3">
                    <div className="me-2">status</div>
                    <div className="me-2">file_name</div>
                    <div className="me-2">size</div>
                    <div className="me-2">✓correct_objs</div>
                    <div className="me-2">ⓧincorrect_objs</div>
                </div>
                {filesStatus.map(status => 
                    <div className="col-12 row" key={status.filename}>
                        <div className="col-1">{status.icon}</div>
                        <div className="col-6 text-truncate">{status.filename}</div>
                        <div className="col-3">{status.filesize / 1000} KB</div>
                        <div className="col-1">✓{status.correct_obj_count}</div>
                        <div className="col-1">ⓧ{status.incorrect_obj_count}</div>
                    </div>
                    )}
            </div>
            <div className="col-12">
                <button className="btn btn-primary col-12" onClick={handleOKClick} disabled={loading}>OK</button>
            </div>
        </div>
  );
}