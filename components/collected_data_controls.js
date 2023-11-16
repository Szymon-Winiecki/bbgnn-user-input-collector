
export default function CollectedDataControls({ OnSendSelectedClick, OnRemoveSelectedClick, OnSendAllClick}) {

    return (
        <div className="col-10 offset-1 row g-2">
            <div className="col-6">
                <button className="btn btn-primary col-12" onClick={OnSendSelectedClick}>Send selected</button>
            </div>
            <div className="col-6">
                <button className="btn btn-danger col-12" onClick={OnRemoveSelectedClick}>remove selected</button>
            </div>
            <div className="col-12">
                <button className="btn btn-success col-12" onClick={OnSendAllClick}>Send all to server</button>
            </div>
        </div>
  );
}