
export default function CollectedDataFilters({ OnApplyClick }) {

    return (
        <div className="col-10 offset-1 row g-2">
            <div className="col-12">
                <button className="btn btn-success col-12" onClick={OnApplyClick}>Apply</button>
            </div>
        </div>
  );
}