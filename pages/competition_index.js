import { useState } from 'react';
import HiddenLayout from '../components/hidden_layout';
import Link from 'next/link';

export default function CompetitionIndex() {

    const [code, setCode] = useState('');
    const [classNumber, setClassNumber] = useState('');
    const [studentNumber, setStudentNumber] = useState('');

    function handleChangeCode(event){
        setCode(event.target.value);
    }

    function handleChangeClassNumber(event){
        setClassNumber(event.target.value);
    }

    function handleChangeStudentNumber(event){
        setStudentNumber(event.target.value);
    }
    
    return (
        <HiddenLayout title="konkurs">
            <div className='col'>
                <div>
                    <h1>Konkurs Szybkiego Pisania</h1>
                </div>
                <div>
                    Aby dołączyć do konkursu, wpisz kod dostępu podany przez nauczyciela, klasę oraz numer z dziennika
                </div>
                <div className='col-12'>
                    <form className='col-6'>
                        <div className="input-group mb-3">
                            <span className="input-group-text col-3">kod dostępu</span>
                            <input type="text" className="form-control" placeholder="Tj6RT2l" value={code} onChange={handleChangeCode}/>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text col-3">klasa</span>
                            <input type="text" className="form-control" placeholder="5A" value={classNumber} onChange={handleChangeClassNumber}/>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text col-3">numer z dziennika</span>
                            <input type="text" className="form-control" placeholder="12" value={studentNumber} onChange={handleChangeStudentNumber}/>
                        </div>
                        <div className="col-12">
                            <Link href={`/competition?code=${code}&class=${classNumber}&student=${studentNumber}`} className='col-12'><input type='button' className='btn btn-primary col-12' value="Dołącz" /></Link>
                        </div>
                    </form>
                </div>
            </div>
        </HiddenLayout>
    );
}
