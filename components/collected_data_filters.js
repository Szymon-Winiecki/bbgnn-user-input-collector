
export default function CollectedDataFilters({ users, phrases, OnApplyClick }) {

    return (
        <div className="col-10 offset-1 row g-2">

            <div className="fs-3">Sort</div>

            <div className="input-group mb-3">
                <label className="input-group-text">Sort by</label>
                <select className="form-select w-50" defaultValue="default" disabled >
                    <option value="default">Choose...</option>
                    <option value="date">Date</option>
                    <option value="user">User</option>
                    <option value="phrase">Phrase</option>
                </select>
                <select className="form-select" defaultValue="default" disabled >
                    <option value="default">Default</option>
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </select>
            </div>
            
            <div className="fs-3">Limit</div>

            <div className="input-group mb-3">
                <label className="input-group-text">Limit date</label>
                <input type="datetime-local" className="form-control" disabled />
                <label className="input-group-text">-</label>
                <input type="datetime-local" className="form-control" disabled />
            </div>

            <div className="input-group mb-3">
                <label className="input-group-text">Limit users</label>
                <select className="form-select" multiple defaultValue={["all"]} disabled >
                    <option value="all">All</option>
                    {users.map( (user, index) => {
                        return <option value={user} key={index}></option>
                    })}
                </select>
            </div>


            <div className="input-group mb-3">
                <label className="input-group-text">Limit phrase</label>
                <input type="text" list="phrases-list" className="form-control" disabled />
                <datalist id="phrases-list">
                    {phrases.map( (phrase, index) => {
                        return <option value={phrase} key={index}></option>
                    })}
                </datalist>
            </div>

            <div className="col-12">
                <button className="btn btn-primary col-12" onClick={OnApplyClick}>Apply</button>
            </div>
        </div>
  );
}