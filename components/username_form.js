

export default function UsernameForm({ disable, predefinedUsernames, OnChange }) {
  return (
    <div className="border p-3">
        <div className="mb-3 col-12">
            <h3>User</h3>
        </div>
        <div className="mb-3 col-12">
            <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">username</span>
                <input type="text" list="predefined-users" className="form-control" placeholder="Username" aria-label="Username" disabled={disable} onChange={OnChange} />
                <datalist id="predefined-users">
                    {predefinedUsernames.map( (username, index) => {
                        return <option value={username} key={index}></option>
                    })}
                </datalist>
            </div>
        </div>
    </div>
  );
}