export default function InputDataTable({ inputData }) {
  return (
    <table className="table">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">key</th>
                <th scope="col">pressed down [ms]</th>
                <th scope="col">released [ms]</th>
                <th scope="col">pressing time [ms]</th>
            </tr>
        </thead>
        <tbody>
            { inputData.map( (row, index) => {
                return <tr class="data-row">
                            <td scope="row">{index}</td>
                            <td>{row.key}</td>
                            <td>{row.keyDownTime.toFixed(2)}</td>
                            <td>{row.keyUpTime.toFixed(2)}</td>
                            <td>{(row.keyUpTime - row.keyDownTime).toFixed(2)}</td>
                        </tr>;
            })}

        </tbody>
    </table>
  );
}