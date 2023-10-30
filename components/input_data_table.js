import style from './input_data_table.module.css'

export default function InputDataTable({ inputData }) {
  return (
    <table className={`table ${style.previewTable}`}>
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
                return <tr className="data-row" key={index}>
                            <td scope="row">{index}</td>
                            <td>{row.key}</td>
                            <td>{row.keyDownTime != undefined ? row.keyDownTime.toFixed(2) : '-'}</td>
                            <td>{row.keyUpTime != undefined ? row.keyUpTime.toFixed(2) : '-'}</td>
                            <td>{(row.keyDownTime != undefined && row.keyUpTime != undefined) ? (row.keyUpTime - row.keyDownTime).toFixed(2) : '-'}</td>
                        </tr>;
            })}

        </tbody>
    </table>
  );
}