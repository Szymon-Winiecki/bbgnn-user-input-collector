import * as fs from 'fs';
import * as path from 'path';

import { recordsOnPage } from '../../utilityHelper';
import { AppDatabase } from './AppDatabase';

const STORAGE_ROOT_DIRECTORY = 'Storage/SQLite/CollectedInputData/';
const STORAGE_FILE_NAME = 'Data.db';

const storageFilePath = path.join(STORAGE_ROOT_DIRECTORY, STORAGE_FILE_NAME);

export async function initStorage(){
    fs.mkdirSync(STORAGE_ROOT_DIRECTORY, {recursive: true});
    
    if(!fs.existsSync(storageFilePath)){
        const db = new AppDatabase(storageFilePath);

        await db.createUserTable();
        await db.createPhraseTable();
        await db.createSequenceTable();
        await db.createDataInfoTable();
    }
    else{
        console.error("Init failed, database exists.");
    }
}

export async function resetStorage(){
    if(fs.existsSync(storageFilePath)){
        const db = new AppDatabase(storageFilePath);

        await db.dropDataInfoTable();
        await db.dropUserTable();
        await db.dropPhraseTable();
        await db.dropSequenceTable();

        await db.createUserTable();
        await db.createPhraseTable();
        await db.createSequenceTable();
        await db.createDataInfoTable();
    }
}

export async function readAll(){
    const db = new AppDatabase(storageFilePath);

    const rows = await db.getAllUserInputData()

    rows.forEach(row => {
        row.sequence = JSON.parse(row.sequence);
    });
    return rows;
}

export async function read(id){
    const db = new AppDatabase(storageFilePath);
    const row = await db.getUserInputData(id);
    if(!row){
        return false;
    }
    return row;
}

export async function select(query){
    let records = await readAll();
    records = Array.from(records);

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
    const itemsOnPage = query.recordsOnPage ?? 10;

    const pagination = recordsOnPage(records.length, parseInt(page), parseInt(itemsOnPage));

    return {
        allRecordsCount: records.length,
        records: records.slice(pagination.from, pagination.to)
    }
}

export async function save(data){
    const db = new AppDatabase(storageFilePath);

    let user_id = await db.getUserId(data.user);
    if(user_id == undefined){
        user_id = await db.insertUser(data.user, Date.now());
    }
    user_id = user_id.id;

    let phrase_id = await db.getPhraseId(data.phrase);
    if(phrase_id == undefined){
        phrase_id = await db.insertPhrase(data.phrase);
    }
    phrase_id = phrase_id.id;

    let sequence_id = await db.insertSequence(JSON.stringify(data.sequence));
    sequence_id = sequence_id.id;

    await db.insertDataInfo(user_id, phrase_id, sequence_id, data.finishDate);

    return true;
}

export function saveMany(data){

    data.forEach(d => {
       save(d);
    });

    return true;
}


// TODO
export function update(data){
    return false;
}

export async function remove(id, deleteUserIfOrphan=false, deletePhraseIfOrphan=false){
    const db = new AppDatabase(storageFilePath);
    let dataInfo = await db.getDataInfo(id);
    if(!dataInfo){
        return false;
    }
    
    await db.deleteSequence(dataInfo.sequence_id);
    await db.deleteDataInfo(dataInfo.id);

    if(deleteUserIfOrphan){
        //TODO
    }

    if(deletePhraseIfOrphan){
        //TODO
    }

    return true;
}

export async function getAllUsernames(){
    const db = new AppDatabase(storageFilePath);
    const users = await db.getAllUsernames();
    return users.map(user => user.username);
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