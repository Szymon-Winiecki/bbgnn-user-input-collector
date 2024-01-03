import HiddenLayout from '../components/hidden_layout';

import { useEffect, useRef, useState } from 'react';

import KeyboardInputData from '../util/KeyboardInputData';
import { getResultsForUser, getStats, saveDataForCompetition } from '../util/ClientSideFetches/competitionAPI';
import * as bl from '../util/BusinessLogic/competition';

export default function CompetitionIndex( {competitionCode, competition_id, studentNumber, classNumber, phrase, repetitions} ) {

    let currentInputData = useRef(null);
    
    let [results, setResults] = useState([]);
    const [input, setInput] = useState("");
    const [writing, setWriting] = useState(false);    //  has user started typing?
    const [disableInput, setDisableInput] = useState(false);

    /*
        utility functions
    */

    function startRecording(){
        setWriting(true);
        const username = `${competitionCode}_${classNumber}_${studentNumber}`;
        currentInputData.current = new KeyboardInputData(username, phrase);
    }

    function stopRecording(){
        currentInputData.current.SetFinishDate(Date.now());
        setDisableInput(true);
    }

    function resetInput(){
        setInput("");
        setWriting(false);
        setDisableInput(false);
    }

    function saveRecordedData(){
        if(!currentInputData.current) return;
        sendToServer(currentInputData.current.GetAsSerializableObject(), competition_id)
    }

    async function getPreviousResults(){
        const username = `${competitionCode}_${classNumber}_${studentNumber}`;
        const stats = await getResultsForUser(username);
        if(!stats.ok){
            console.log('failed to load stats');
            return;
        }
        setResults(stats.body);
    }

    async function sendToServer(data, competition_id){
        const response = await saveDataForCompetition(data, competition_id);

        if(response.ok){
            console.log('data saved');
            getPreviousResults();
        }
        else{
            console.log('failed to save data');
        }
    }

    /*
        event handlers
    */

    function submit(){
        if(!writing) return;
        stopRecording();
        saveRecordedData();
        resetInput();
    }

    function cancel(){
        if(!writing) return;
        stopRecording();
        resetInput();
    }

    function registerKeyDown(event){
        if(!writing){
            startRecording();
        }
        currentInputData.current.RegisterKeyDown(event.key, event.timeStamp, event.target.selectionStart, event.target.selectionEnd);
    }

    function registerKeyUp(event){
        if(!writing){
            return;
        }
        currentInputData.current.RegisterKeyUp(event.key, event.timeStamp);
    }

    function handleInputChange(event){
        setInput(event.target.value);
    }


    useEffect(() => {
        getPreviousResults();
    }, [])
    
    return (
        <HiddenLayout title="konkurs">
            <div className='col'>
                <div>
                    <h1>Konkurs Szybkiego Pisania</h1>
                </div>
                <div>
                    <div>numer z dziennika: <span>{studentNumber}</span></div>
                    <div>klasa: <span>{classNumber}</span></div>
                </div>
                <div className='my-2'>
                    Przepisz podane zdanie do komórki poniżej. Pamiętaj, liczy się nie tylko czas ale i poprawność. Czas liczy się od momentu wprowadzenia pierwszej litery do wprowadzenia ostatniej. Ostateczny wynik to suma czasu przepisywania i kary za błądy (pół sekundy za każdy błąd). Im mniej punktów tym lepiej. Masz {repetitions} prób. Liczy się tylko wynik z najleszpej próby.
                </div>
                
                <div className='col-12'>
                    {results.length >= repetitions && <div className='fs-2 text-danger fw-bold mt-2'>Wykorzystano wszystkie próby</div>}
                    {results.length < repetitions &&
                    <form className='offset-3 col-6'>
                        <div className="mb-3">
                            <div className="">tekst do przepisania:</div>
                            <div className='fw-bold'>{phrase}</div>
                        </div>
                        <div className="mb-3">
                            <div className="">tu przepisz zdanie:</div>
                            <textarea 
                                value={input} 
                                onKeyDown={registerKeyDown} 
                                onKeyUp={registerKeyUp} 
                                onChange={handleInputChange} />
                        </div>
                        <div className="col-12">
                            <input type='button' className="btn btn-primary col-12" value="Zatwierdź" onClick={submit}/>
                        </div>
                    </form>
                    }
                    <div className='mt-4'>
                        <div className='fs-3 mb-2'>wykorzystane próby: <span className='fw-bold'>{results.length}/{repetitions}</span></div>

                        <div className='col-6 row border-bottom border-3 fw-bold'>
                                <div className='col-1'>lp.</div> 
                                <div className='offset-1 col-3'>czas</div>
                                <div className='offset-1 col-3'>błędy</div>
                                <div className='offset-1 col-2'>punkty</div>
                            </div>
                        {results.map((result, i) => 
                            <div className='col-6 row border-bottom'>
                                <div className='col-1'>{i}.</div> 
                                <div className='offset-1 col-3'>{(result.time / 1000).toFixed(3)} s</div>
                                <div className='offset-1 col-3'>{result.typos} błędów</div>
                                <div className='offset-1 col-2'>{result.score.toFixed(3)}</div>
                            </div> )}
                        <div className='mt-2'>najlepszy wynik: <span className='fw-bold'>{results.reduce((prev, curr) => curr.score < prev ? curr.score.toFixed(3) : prev, 100000)}</span></div>
                    </div>
                </div>
            </div>
        </HiddenLayout>
    );
}

export async function getServerSideProps({ query }) {
    const code = query.code;
    const studentNumber = query.student;
    const classNumber = query.class;

    const competition = await bl.getByCode(code);

    if(!competition){
        return {
            redirect: {
              permanent: false,
              destination: "/competition_index"
            }
          }
    }

    return { props: {
        competitionCode: code, 
        competition_id: competition.id, 
        studentNumber: studentNumber, 
        classNumber: classNumber, 
        phrase: competition.phrase,
        repetitions: competition.repetitions,
    } }
}
