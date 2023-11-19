import * as fs from 'fs';
import * as path from 'path';

const STORAGE_ROOT_DIRECTORY = 'Storage/CollectedInputData/';
const STORAGE_FILE_NAME = 'Data.json';
const STORAGE_EMPTY_DATA = []
const META_FILE_NAME = 'info.json';
const META_EMPTY_DATA = {
    maxId: 0,
    count: 0,
};

const storageFilePath = path.join(STORAGE_ROOT_DIRECTORY, STORAGE_FILE_NAME);
const metaFilePath = path.join(STORAGE_ROOT_DIRECTORY, META_FILE_NAME);

export function initStorage(){
    fs.mkdirSync(STORAGE_ROOT_DIRECTORY, {recursive: true});
    
    if(!fs.existsSync(storageFilePath) || !fs.existsSync(metaFilePath)){
        fs.writeFileSync(storageFilePath, JSON.stringify(STORAGE_EMPTY_DATA));
        fs.writeFileSync(metaFilePath, JSON.stringify(META_EMPTY_DATA));
    }
    else{
        console.error("Init failed, directory exists.");
    }
}

export function resetStorage(){
    if(fs.existsSync(storageFilePath)){
        fs.writeFileSync(storageFilePath, JSON.stringify(STORAGE_EMPTY_DATA));
        fs.writeFileSync(metaFilePath, JSON.stringify(META_EMPTY_DATA));
    }
}

export function readAll(){
    const raw = fs.readFileSync(storageFilePath, {encoding: "utf-8"});
    return JSON.parse(raw);
}

export function read(id){
    const current = JSON.parse(fs.readFileSync(storageFilePath, {encoding: "utf-8"}));
    const index = current.findIndex(data => data.id == id);
    if(index == -1){
        return false;
    }
    return current[index];
}

export function select(query){
    let records = readAll();

    records = records.filter(record => checkSelectConditions(record, query));

    const numericFieds = ['finishDate', 'id'];
    const textFields = ['user', 'phrase'];

    
    if(query.sortField){
        const asc = query.sortAsc == 'false' ? false : true;
        if(numericFieds.includes(query.sortField)){
            records.sort(getByFieldNumericSorter(query.sortField, asc));
        }
        else if(textFields.includes(query.sortField)){
            records.sort(getByFieldTextSorter(query.sortField, asc));
        }
    }

    const page = query.page ?? 1;
    const itemsOnPage = query.itemsOnPage ?? 10;

    const pagination = recordsOnPage(records.length, page, itemsOnPage);

    return {
        allRecordsCount: records.length,
        pageRecords: records.slice(pagination.from, pagination.to)
    }
}

export function save(data){
    const current = JSON.parse(fs.readFileSync(storageFilePath, {encoding: "utf-8"}));

    data.id = registerAndGetID();

    current.push(data);
    fs.writeFileSync(storageFilePath, JSON.stringify(current));

    return true;
}

export function saveMany(data){
    const current = JSON.parse(fs.readFileSync(storageFilePath, {encoding: "utf-8"}));

    data.forEach(d => {
        d.id = registerAndGetID();
        current.push(d);
    });
    
    fs.writeFileSync(storageFilePath, JSON.stringify(current));

    return true;
}

export function update(data){
    if(data.id == undefined){
        return false;
    }

    const current = JSON.parse(fs.readFileSync(storageFilePath, {encoding: "utf-8"}));
    const index = current.findIndex(element => element.id == data.id);
    if(index == -1){
        return false;
    }

    current[index] = data;
    fs.writeFileSync(storageFilePath, JSON.stringify(current));

    return current[index];
}

export function remove(id){
    const current = JSON.parse(fs.readFileSync(storageFilePath, {encoding: "utf-8"}));
    const index = current.findIndex(data => data.id == id);
    if(index == -1){
        return false;
    }
    current.splice(index, 1);

    fs.writeFileSync(storageFilePath, JSON.stringify(current));

    return true;
}

function registerAndGetID(){
    const meta = JSON.parse(fs.readFileSync(metaFilePath, {encoding: "utf-8"}));
    const id  = ++meta.maxId;
    fs.writeFileSync(metaFilePath, JSON.stringify(meta));
    return id;
}

function checkSelectConditions(record, query){
    if(query.dateMin && record.finishDate < query.dateMin) return false;
    if(query.dateMax && record.finishDate > query.dateMax) return false;
    if(query.phrase && record.phrase != query.phrase) return false;
    if(query.users && !query.users.includes(record.user)) return false;
    
    return true;
}

function getByFieldNumericSorter(field, asc){
    return (a, b) => {
        if(a[field] < b[field]) return asc ? -1 : 1;
        else if(a[field] > b[field]) return asc ? 1 : -1;
        else return 0;
    }
}

function getByFieldTextSorter(field, asc){
    return (a, b) => {
        return a[field].localeCompare(b[field]) * (asc ? 1 : -1);
    }
}

function recordsOnPage(all, page, itemsOnPage){
    const from = (page - 1) * itemsOnPage;
    const to = from + itemsOnPage;
    return {
        from: Math.min(from, all),
        to: Math.min(to, all)
    }
}