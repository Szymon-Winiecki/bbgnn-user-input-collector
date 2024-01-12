
export default function CollectedDataFilters({ recordsOnPage, allUsers, phrases, typos, OnTyposChange, minUserDataCount, OnMinUserDataCountChange, minCompetitionDataCount, OnMinCompetitionrDataCountChange, OnApplyClick, sortField, OnRecordsOnPageChange, OnSortFieldChange, sortOrder, OnSortOrderChange, users, OnUsersChange, phrase, OnPhraseChange }) {

    return (
        <div className="col-10 offset-1 row g-2">

            <div className="fs-3">Sort</div>

            <div className="input-group mb-3">
                <label className="input-group-text">Sort by</label>
                <select className="form-select w-50" value={sortField} onChange={OnSortFieldChange} >
                    <option value="default">Choose...</option>
                    <option value="finishDate">Date</option>
                    <option value="user">User</option>
                    <option value="phrase">Phrase</option>
                    <option value="typos">Typos</option>
                </select>
                <select className="form-select" value={sortOrder} onChange={OnSortOrderChange} >
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
                <select className="form-select" multiple value={users} onChange={OnUsersChange} >
                    {allUsers.map( (user, index) => {
                        return <option value={user} key={index}>{user}</option>
                    })}
                </select>
            </div>


            <div className="input-group mb-3">
                <label className="input-group-text">Limit phrase</label>
                <input type="text" list="phrases-list" className="form-control" value={phrase} onChange={OnPhraseChange} />
                <datalist id="phrases-list">
                    {phrases.map( (phrase, index) => {
                        return <option value={phrase} key={index}></option>
                    })}
                </datalist>
            </div>

            <div className="input-group mb-3">
                <label className="input-group-text">Max typos (-1 = inf)</label>
                <input type="number" min="-1" className="form-control" value={typos} onChange={OnTyposChange} />
            </div>

            <div className="input-group mb-3">
                <label className="input-group-text">Min records per user</label>
                <input type="number" min="0" className="form-control" value={minUserDataCount} onChange={OnMinUserDataCountChange} />
            </div>

            <div className="input-group mb-3">
                <label className="input-group-text">Min records per competition</label>
                <input type="number" min="0" className="form-control" value={minCompetitionDataCount} onChange={OnMinCompetitionrDataCountChange} />
            </div>

            <div className="col-12">
                <button className="btn btn-primary col-12" onClick={OnApplyClick}>Apply</button>
            </div>
        </div>
  );
}