import Layout from '../components/layout';
import UsernameForm from '../components/username_form';
import PhraseForm from '../components/phrase_form';
import CollectedDataList from '../components/collected_data_list';
import DataPreviewSection from '../components/data_preview_section';
import CollectedDataControls from '../components/collected_data_controls';

import { useRef, useState } from 'react';

import KeyboardInputData from '../util/KeyboardInputData';
import staticDataLoader from '../util/staticDataLoader';
import ToastSection from '../components/toast_section';

export default function Collect( {predefinedUsernames, predefinedPhrases} ) {
    
    let currentInputData = useRef(null);
    
    let [inputDataList, setInputDataList] = useState([]);
    const [username, setUsername] = useState("");
    const [phrase, setPhrase] = useState("");
    const [input, setInput] = useState("");
    const [writing, setWriting] = useState(false);    //  has user started typing?
    const [disableInput, setDisableInput] = useState(false);

    const [activeRecord, setActiveRecord] = useState(null);

    const [toasts, setToasts] = useState([]);

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
        setInputDataList(old => [...old, currentInputData.current.GetAsSerializableObject()]);
    }

    function showToast(title, body, status){
        const toast = {
            title: title,
            body: body,
            status: status,
            time: Date.now()
        }
        setToasts(old => [...old, toast])
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

    function handleRecordRemoveClick(event, index){
        setInputDataList(old => old.filter(((_, i) => i != index)));
    }

    function handleCloseToastClick(event, id){
        if(id >= event.length && id < 0) return;

        setToasts(old => [...(old.slice(0, id)), ...(old.slice(id + 1, old.length))]);
    }

    async function handleSendAllClick(event){

        if(inputDataList.length == 0){
            showToast('No data to send', `There is no any data to send`, 'warning');
            return;
        }

        const status = await sendCollectedData(inputDataList);

        if(status == 201){
            showToast('Data sent', `Successfully sent ${inputDataList.length} data records`, 'success');
            setInputDataList([]);   //TODO: remove only sent data (user can create a new record while request is being processed)
        }
        else{
            showToast('Sending failed', `Can't send the data`, 'danger');
        }
    }

    /*
        API calls
    */

    async function sendCollectedData(data = []) {
        const url = "http://127.0.0.1:3000/api/collectedData";
        
        try{
            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify(data),
            });
            return response.status;
        }
        catch (e){
            console.log(e);
            return 500;
        }
        
    }

    return (
        <Layout page="collect">
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
                    <div className="col-12 border p-4 h-100 d-flex flex-column justify-content-between">
                        <CollectedDataList 
                            collectedData={inputDataList} 
                            OnActiveRecordChanged={setActiveRecord}
                            OnRemoveRecordClick={handleRecordRemoveClick} />
                        <CollectedDataControls 
                            OnSendAllClick={handleSendAllClick} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <DataPreviewSection inputData={activeRecord} />
                </div>
            </div>
            <ToastSection toasts={toasts} maxToasts={5} OnCloseClick={handleCloseToastClick} />
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
