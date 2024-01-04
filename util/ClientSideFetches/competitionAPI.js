import { getApiBaseUrl } from "./serverAddress";

export async function getCompetitionByCode(code) {
    const url = getApiBaseUrl() + "competition/" + code;

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

export async function createCompetition(competition) {
    const url = getApiBaseUrl() + "competition";
    
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
            body: JSON.stringify(competition),
        });
        return {
            ok: response.ok,
            status: response.status,
            body: await response.json()
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

export async function saveDataForCompetition(data, competition_id) {
    const url = getApiBaseUrl() + "competition/" + competition_id + "/data";
    
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
            body: await response.json()
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

export async function getStats(data_id) {
    const url = getApiBaseUrl() + "collectedData/" + data_id + "/stats";

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

export async function getResultsForUser(username) {
    const url = getApiBaseUrl() + "competition/results?user=" + username;

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