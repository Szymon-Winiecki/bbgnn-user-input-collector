import style from './phrase_form.module.css'

export default function PhraseForm({ phrase, input, writing, disableInput, predefinedPhrases, OnPhraseSelect, OnPhraseChange, OnInputChange, OnInputFocus, OnInputBlur, OnRandomPhraseClicked, OnKeyDown, OnKeyUp, OnSubmit, OnCancel }) {
    return (
        <div className="border p-3 mt-4">
            <div className="mb-3 col-12">
                <div className="input-group mb-3" id="phrase-input-group">
                    <textarea  type="text" list="predefined-phrases" className={`${style.phraseInput} form-control form-control-lg`} placeholder="Phrase to retype" id="phrase-to-retype" disabled={writing} onChange={OnPhraseChange} value={phrase}></textarea>
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Select</button>
                    <ul className="dropdown-menu">
                        {predefinedPhrases.map( (phrase, index) => {
                            return <li onClick={() => OnPhraseSelect(phrase)} key={index}><a className="dropdown-item">{phrase}</a></li>
                        })}
                    </ul>
                    <button className="btn btn-outline-secondary" type="button" id="random-phrase-button" onClick={OnRandomPhraseClicked}>Random</button>
                    <datalist id="predefined-phrases">
                        <option value="Ala ma kota"></option>
                    </datalist>
                    </div>
            </div>
            <div className="mb-3 col-12">
                <label htmlFor="phrase-intput" className="form-label">retype the phrase here:</label>
                <input type="text" autoComplete="off" className="form-control" id="phrase-intput" aria-describedby="phrase-intput-help" disabled={disableInput} value={input} onKeyDown={OnKeyDown} onKeyUp={OnKeyUp} onChange={OnInputChange} onFocus={OnInputFocus} onBlur={OnInputBlur} />
                <div id="phrase-intput-help" className={`form-text ${writing ? "" : "invisible"}`}>The data collection process will end if you click outside the text field.</div>
            </div>
            <div className="col-12 row mx-0 gx-4">
                <div className="col-6 ps-0"><button type="button" className="btn btn-primary w-100" id="submit-button" onClick={OnSubmit}>Submit</button></div>
                <div className="col-6 pe-0"><button type="button" className="btn btn-danger w-100" id="cancel-button" onClick={OnCancel}>Cancel</button></div>
                
                
            </div>
        </div>
    );
}