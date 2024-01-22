const demoServerUrl = "http://127.0.0.1:8080/"

export async function predict(data) {
    const url = demoServerUrl + "datatorch";

    console.log(url)
    
    try{
        const response = await fetch(url, {
            method: "POST",
            credentials: "include",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
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