import { useState } from "react";

export default function CollectedDataDownloadControls({ OnDownload }) {

    const [format, setFormat] = useState("raw");

    function handleChangeFormat(event){
        if(format == event.target.value) return;
        setFormat(event.target.value);
    }

    function handleDownloadAllClick(event){
        OnDownload(true, format);
    }

    function handleDownloadSelectedClick(event){
        OnDownload(false, format);
    }

    return (
        <div className="col-10 offset-1 row g-2">
            <div className="input-group mb-3">
                <label className="input-group-text">Format</label>
                <select className="form-select w-50" value={format} onChange={handleChangeFormat}>
                    <option value="raw">RAW</option>
                    <option value="ssr">SSR</option>
                    <option value="torch">Torch</option>
                </select>
            </div>
            <div className="col-6">
                <button className="btn btn-success col-12" onClick={handleDownloadSelectedClick}>Download selected</button>
            </div>
            <div className="col-6">
                <button className="btn btn-success col-12" onClick={handleDownloadAllClick}>Download all</button>
            </div>
        </div>
  );
}