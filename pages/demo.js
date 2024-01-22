import HiddenLayout from'../components/hidden_layout'
import PhraseForm from '../components/phrase_form';

import { useRef, useState } from 'react';

import KeyboardInputData from '../util/KeyboardInputData';
import * as DemoAppAPI from '../util/ClientSideFetches/demoAppAPI'
import RecordedInput from '../components/recorded_input';
import { collectedDataToTorchData } from '../util/dataRepresentation';

export default function Demo( {phrase} ) {
    
    let currentInputData = useRef(null);

    const [input, setInput] = useState("");
    const [writing, setWriting] = useState(false);    //  has user started typing?
    const [disableInput, setDisableInput] = useState(false);

    const [prediction, setPrediction] = useState(undefined);

    /*
        utility functions
    */

    function startRecording(username, phrase){
        setWriting(true);
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

    /*
        event handlers
    */

    async function submit(){
        if(!writing) return;
        stopRecording();
        await handlePredict();
        resetInput();
    }

    function cancel(){
        if(!writing) return;
        stopRecording();
        resetInput();
    }

    function registerKeyDown(event){
        if(!writing){
            startRecording('?', phrase);
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

    function handleInputBlur(event){
        if(!writing) return;
        stopRecording();
    }

    async function handlePredict(event){
        if(!currentInputData.current) return;
        

        const response = await DemoAppAPI.predict(collectedDataToTorchData([currentInputData.current.GetAsSerializableObject()]))

        if(response.ok){
            setPrediction(response.body)
        }
        else{
            console.log(`Prediction query failed with status  ${response.status}`);
        }
    }

    return (
        <HiddenLayout>
            <div className="row">
                <div className="col-12 col-xl-6 offset-xl-3">
                    <form className="col-12">
                        <div className='my-3 col-12'>
                            <div className='fw-bold fs-2 w-100 text-center'>{phrase}</div>
                        </div>
                        
                        <RecordedInput 
                            writing={writing} 
                            disableInput={disableInput} 
                            input={input} 
                            OnInputChange={handleInputChange} 
                            OnKeyDown={registerKeyDown} 
                            OnKeyUp={registerKeyUp} 
                            OnInputBlur={handleInputBlur}
                            blurAlertText={"Jeżeli klikniesz poza pole tekstowe, zbieranie danych zostanie automatycznie zakończone"}
                            resetInfoText={"Zbieranie danych zakończone, naciśnij Anuluj, aby zresetować pole tekstowe"}
                            encouragementText={"Wpisz pierwszy znak, aby rozpocząć zbieranie zbieranie danych"}/>

                        <div className="col-12 row mx-0 gx-4">
                            <div className="col-6 ps-0"><button type="button" className="btn btn-primary w-100" id="submit-button" onClick={submit}>Sprawdź</button></div>
                            <div className="col-6 pe-0"><button type="button" className="btn btn-danger w-100" id="cancel-button" onClick={cancel}>Anuluj</button></div>
                        </div>

                        { prediction && 
                        <div className='col-12 mt-4'>
                            <div className='row'>
                                <div className='col-auto fw-bold'>wynik predykcji:</div>
                                <div className='col-auto'>{prediction.username}</div>
                            </div>
                            
                            <div className='col-12 fw-bold mt-3'>prawdopodobieństwa przynależności do klas:</div>
                            <div className='col-12'>
                                {prediction.probabilities.map(prob => 
                                    <div className='row' key={prob[0]}>
                                        <div className='offset-1 col-3 fst-italic'> {prob[0]} </div>
                                        <div className='col-auto'> {(parseFloat(prob[1]) * 100).toFixed(5)}% </div>
                                    </div>
                                )}
                            </div>

                            <div className='row mt-3'>
                                <div className='col-auto fw-bold'>czas predykcji:</div>
                                <div className='col-auto'>{parseFloat(prediction.time).toFixed(2)} ms</div>
                            </div>
                        </div>
                        }
                    </form>
                </div>
            </div>
        </HiddenLayout>
    );
}

export async function getServerSideProps(context) {
    return {
      props: {
        phrase: "bagnet szkło cytryna hokej"
      },
    };
  }
