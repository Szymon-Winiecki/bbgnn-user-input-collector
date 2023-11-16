import * as storage from '../Storage/FileStorage/collectedInputDataStorage.js';

export function initStorage(){
    storage.initStorage();
}

export function resetStorage(){
    storage.resetStorage();
}

export function getAll(){
    return storage.readAll();
}

export function get(id){
    return storage.read(id);
}

export function add(data){
    if(Array.isArray(data)){
        console.log("array")
        return storage.saveMany(data);
    }
    return storage.save(data);
}

export function update(data){
    return storage.update(data);
}

export function remove(id){
    return storage.remove(id);
}