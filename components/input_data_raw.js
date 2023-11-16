export default function InputDataRaw({ inputData }) {
    if(!inputData){
        return <div> No data </div>
    }

    return (
        <pre>
            {JSON.stringify(inputData, null, 2)}
        </pre>
    );
  }