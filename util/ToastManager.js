export class ToastManager
{
    #setToasts = (old) => {return {}};

    constructor(setToastsFn){
        this.#setToasts = setToastsFn;
    }

    showToast(title, body, status){
        const toast = {
            title: title,
            body: body,
            status: status,
            time: Date.now()
        }
        this.#setToasts(old => [...old, toast])
    }

    closeToast(id){
        this.#setToasts(old => [...(old.slice(0, id)), ...(old.slice(id + 1, old.length))]);
    }
}