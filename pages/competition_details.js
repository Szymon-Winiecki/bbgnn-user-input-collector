import { useState } from 'react';
import HiddenLayout from '../components/hidden_layout';
import { getCompetitionByCode } from '../util/ClientSideFetches/competitionAPI';
import { useRouter } from 'next/router';

export default function CompetitionIndex() {

    const router = useRouter();

    const [code, setCode] = useState('');
    const [notFound, setNotFound] = useState(false);

    async function chceckCode(code){
        const response = await getCompetitionByCode(code);

        if(response.ok){
            router.push('/competition_details/' + response.body.id);
        }
        else{
            setNotFound(true);
        }
    }

    function handleChangeCode(event){
        setCode(event.target.value);
    }

    function handleNextClick(event){
        chceckCode(code);
    }

    
    return (
        <HiddenLayout title="konkurs">
            <div className='col'>
                <div>
                    <h1>Konkurs Szybkiego Pisania</h1>
                </div>
                <div>
                    Wpisz kod dostępu, aby zobaczyć wyniki
                </div>
                <div className='col-12'>
                    <form className='col-6'>
                        <div className="input-group mb-3">
                            <span className="input-group-text col-3">kod dostępu</span>
                            <input type="text" className="form-control" placeholder="Tj6RT2l" value={code} onChange={handleChangeCode}/>
                        </div>
                        <div className="col-12">
                            <input type="button" onClick={handleNextClick} value="Dalej" />
                        </div>
                        {notFound && <div> Nie istnieje konkurs o takim kodzie dostępu</div>}
                    </form>
                </div>
            </div>
        </HiddenLayout>
    );
}
