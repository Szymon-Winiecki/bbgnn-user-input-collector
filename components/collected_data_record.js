import style from './collected_data_record.module.css'

import { limitStringLength, timestampToString } from "../util/formatingUtils";

export default function CollectedDataRecord({ index, username, title, time, OnClick, OnRemoveClick, OnDownloadClick }) {
  return (
    <div className={`${style.record} col-12 d-flex border-bottom p-1 align-items-center`} onClick={(e) => OnClick(e, index) }>
        <div className="col-1">
            <input type="checkbox" className="form-check-input" />
        </div>
        <span className="col-3 fw-bold cursor-default">{limitStringLength(username, 12)}</span>
        <span className="col-3 cursor-default">{limitStringLength(title, 12)}</span>
        <span className="col-3 text-secondary cursor-default">{timestampToString(time)}</span>
        <div className="col-1 d-flex justify-content-end">
            <button className="btn btn-success btn-sm" onClick={(e) => {OnDownloadClick(e, index); e.stopPropagation();} }><i class="bi bi-file-earmark-arrow-down"></i></button>
        </div>
        <div className="col-1 d-flex justify-content-end">
          <button className="btn btn-danger btn-sm" onClick={(e) => {OnRemoveClick(e, index); e.stopPropagation();} }><i className="bi bi-trash"></i></button>
        </div>
    </div>
  );
}