import * as storage from '../Storage/SQLite/collectedInputDataStorage.js';

export function initStorage(){
    storage.initStorage();
}

export function resetStorage(){
    storage.resetStorage(); 
}

export async function getAll(){
    return await storage.readAll();
}

export async function get(id){
    return await storage.read(id);
}

export async function select(query){
    return await storage.select(query);
}

export function add(data){
    if(Array.isArray(data)){
        console.log("array")
        return storage.saveMany(data);
    }
    return storage.save(data);
}

export async function update(data){
    return await storage.update(data);
}

export function remove(id){
    return storage.remove(id);
}

export async function getAllUsers(){
    const usernames = await storage.getAllUsernames();
    return usernames
}