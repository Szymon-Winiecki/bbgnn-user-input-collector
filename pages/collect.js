import Layout from '../components/layout';
import UsernameForm from '../components/collect/username_form';
import PhraseForm from '../components/collect/phrase_form';
import CollectedDataSection from '../components/collect/collected_data_section';
import DataPreviewSection from '../components/collect/data_preview_section';
import { useRef, useState } from 'react';

import KeyboardInputData from '../util/KeyboardInputData';
import staticDataLoader from '../util/staticDataLoader';

export default function Collect( {predefinedUsernames, predefinedPhrases} ) {
    
    let currentInputData = useRef(null);
    
    let [inputDataList, setInputDataList] = useState([]);
    const [username, setUsername] = useState("");
    const [phrase, setPhrase] = useState("");
    const [input, setInput] = useState("");
    const [writing, setWriting] = useState(false);    //  has user started typing?
    const [disableInput, setDisableInput] = useState(false);

    const [activeRecord, setActiveRecord] = useState(null);

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

    function saveRecordedData(){
        if(!currentInputData.current) return;
        setInputDataList(old => [...old, currentInputData.current]);
    }

    /*
        event handlers
    */

    function submit(){
        stopRecording();
        saveRecordedData();
        resetInput();
    }

    function cancel(){
        stopRecording();
        resetInput();
    }

    function registerKeyDown(event){
        if(!writing){
            startRecording(username, phrase);
        }
        currentInputData.current.RegisterKeyDown(event.key, event.timeStamp);
    }

    function registerKeyUp(event){
        if(!writing){
            return;
        }
        currentInputData.current.RegisterKeyUp(event.key, event.timeStamp);
    }

    function handlePhraseInputChange(event){
        setPhrase(event.target.value);
    }

    function handlePhraseSelect(phrase){
        setPhrase(phrase);
    }

    function handleInputChange(event){
        setInput(event.target.value);
    }

    function handleInputBlur(event){
        if(!writing) return;
        stopRecording();
    }

    function handleUsernameChange(event){
        setUsername(event.target.value)
    }

    return (
        <Layout>
            <div className="row">
                <div className="col-12 col-xl-6">
                    <form className="col-12">
                        <UsernameForm 
                            disable={writing} 
                            predefinedUsernames={predefinedUsernames}
                            OnChange={handleUsernameChange}/>

                        <PhraseForm 
                            writing={writing} 
                            disableInput={disableInput} 
                            phrase={phrase} 
                            input={input} 
                            predefinedPhrases={predefinedPhrases}
                            OnPhraseSelect={handlePhraseSelect}
                            OnPhraseChange={handlePhraseInputChange} 
                            OnInputChange={handleInputChange} 
                            OnSubmit={submit} 
                            OnCancel={cancel} 
                            OnKeyDown={registerKeyDown} 
                            OnKeyUp={registerKeyUp} 
                            OnInputBlur={handleInputBlur}/>
                    </form>
                </div>
                <div className="col-12 col-xl-6 mt-4 mt-xl-0">
                    <CollectedDataSection collectedData={inputDataList} OnActiveRecordChanged={setActiveRecord} />
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <DataPreviewSection inputData={activeRecord} />
                </div>
            </div>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    return {
      props: {
        predefinedUsernames: staticDataLoader.getPredefinedUsernames(),
        predefinedPhrases: staticDataLoader.getPredefinedPhrases(),
      },
    };
  }
