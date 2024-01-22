
export default function RecordedInput({ input, writing, disableInput, OnInputChange, OnInputFocus, OnInputBlur, OnKeyDown, OnKeyUp, blurAlertText, resetInfoText, encouragementText}) {
    return (
        <div className="mb-3 col-12">
            <input type="text" autoComplete="off" className="form-control" id="phrase-intput" aria-describedby="phrase-intput-help" disabled={disableInput} value={input} onKeyDown={OnKeyDown} onKeyUp={OnKeyUp} onChange={OnInputChange} onFocus={OnInputFocus} onBlur={OnInputBlur} />
            <div id="phrase-intput-help" className={`form-text ${writing && !disableInput ? "" : "d-none"}`}>{blurAlertText}</div>
            <div id="phrase-intput-help" className={`form-text ${disableInput ? "" : "d-none"}`}>{resetInfoText}</div>
            <div id="phrase-intput-help" className={`form-text ${!disableInput && !writing ? "" : "d-none"}`}>{encouragementText}</div>
        </div>
    );
}