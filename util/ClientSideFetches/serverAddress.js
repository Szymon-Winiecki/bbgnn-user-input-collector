
export function getServerAddress(){
    const url = new URL(window.location.href);
    return url.origin;
} 

export function getApiBaseUrl(){
    return getServerAddress() + "/api/"; 
}