import { useState } from 'react';
import HiddenLayout from '../components/hidden_layout';
import { timestampToNormalizedString } from '../util/formatingUtils';
import * as competitionAPI from '../util/ClientSideFetches/competitionAPI';
import { useRouter } from 'next/router';

export default function CompetitionIndex() {
    const router = useRouter();
    
    const [phrase, setPhrase] = useState('');
    const [repetitions, setRepetitions] = useState(1);
    const [teacher, setTeacher] = useState('');
    const [startAt, setStartAT] = useState(timestampToNormalizedString(Date.now()));
    const [endAt, setEndAt] = useState(timestampToNormalizedString(Date.now()));

    function handlePhraseChange(event){
        setPhrase(event.target.value);
    }

    function handleRepetitionsChange(event){
        setRepetitions(event.target.value);
    }

    function handleTeacherChange(event){
        setTeacher(event.target.value);
    }

    function handleStartAtChange(event){
        setStartAT(event.target.value);
    }

    function handleEndAtChange(event){
        setEndAt(event.target.value);
    }

    async function handleCreateClick(event){
        const competition = {
            phrase: phrase,
            repetitions: repetitions,
            teacher: teacher,
            start_at: new Date(startAt).getTime(),
            end_at: new Date(endAt).getTime(),
        }

        const response = await competitionAPI.createCompetition(competition);

        if(response.ok){
            console.log("Competition created");
            // console.log('/competition_details/' + response.body);
            router.push('/competition_details/' + response.body);
        }
        else{
            console.log("Competition creation failed, error " + response.status);
        }
    }
    
    
    return (
        <HiddenLayout title="konkurs">
            <div className='col'>
                <div>
                    <h1>Konkurs Szybkiego Pisania</h1>
                </div>
                <div>
                    Stwórz konkurs
                </div>
                <div className='col-12'>
                    <form className='col-6'>
                        <div className="input-group mb-3">
                            <span className="input-group-text col-5">fraza do przepisywania</span>
                            <input type="text" className="form-control" placeholder="Ala ma kota" value={phrase} onChange={handlePhraseChange} aria-label="fraza do przepisywania"/>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text col-5">ilość przepisań</span>
                            <input type="number" className="form-control" min={1} placeholder="10" value={repetitions} onChange={handleRepetitionsChange} aria-label="ilość przepisań"/>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text col-5">nauczyciel</span>
                            <input type="text" className="form-control" placeholder="Anna Kowalska" value={teacher} onChange={handleTeacherChange} aria-label="nauczyciel"/>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text col-5">rozpoczęcie</span>
                            <input type="datetime-local" className="form-control" value={startAt} onChange={handleStartAtChange} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text col-5">zakończenie</span>
                            <input type="datetime-local" className="form-control" value={endAt} onChange={handleEndAtChange} />
                        </div>
                        <div className="col-12">
                            <input type='button' className="btn btn-primary col-12" value="Stwórz" onClick={handleCreateClick} />
                        </div>
                    </form>
                </div>
            </div>
        </HiddenLayout>
    );
}
