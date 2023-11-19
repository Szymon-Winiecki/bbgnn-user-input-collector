const baseURL = "http://127.0.0.1:3000/api/"

export async function getAllRecords() {
    const url = baseURL + "collectedData";

    try{
        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        });

        if(response.ok){
            return {
                ok: true,
                status: response.status,
                body: await response.json()
            };
        }
        else{
            return {
                ok: false,
                status: response.status,
            };
        }
    }
    catch (e){
        console.log(e);
        return {
            ok: false,
            status: 500
        };
    }
    
}

export async function selectRecords(query) {
    
    const searchParams = new URLSearchParams(query);

    const url = baseURL + "collectedData?" + searchParams;

    try{
        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        });

        if(response.ok){
            return {
                ok: true,
                status: response.status,
                body: await response.json()
            };
        }
        else{
            return {
                ok: false,
                status: response.status,
            };
        }
    }
    catch (e){
        console.log(e);
        return {
            ok: false,
            status: 500
        };
    }
    
}

export async function removeRecord(id) {
    const url = baseURL + "collectedData/" + id;

    try{
        const response = await fetch(url, {
            method: "DELETE",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        });

        return {
            ok: response.ok,
            status: response.status,
        };
    }
    catch (e){
        console.log(e);
        return {
            ok: false,
            status: 500
        };
    }
    
}

export async function sendRecords(data) {
    const url = baseURL + "collectedData";
    
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
        return {
            ok: response.ok,
            status: response.status,
        };
    }
    catch (e){
        console.log(e);
        return {
            ok: false,
            status: 500,
        };
    }
    
}