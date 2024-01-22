import { calculateAdditionalInfo, calculateDeviationFromMean, groupByCompetition, groupByUser } from '../../Analysis/dataAnalysis';
import { recordsOnPage, shuffle } from '../../utilityHelper';
import { AppDatabase } from './AppDatabase';
import { storageFilePath } from './common';


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
    row.sequence = JSON.parse(row.sequence);
    return row;
}

export async function select(query){
    let records = await readAll();
    records = Array.from(records);

    calculateAdditionalInfo(records);
    records = records.filter(record => checkSelectConditions(record, query));

    if(!isNaN(query.maxTimeDeviationFromUserMean) || !isNaN(query.maxTyposDeviationFromUserMean)){
        const groupedByUser = groupByUser(records);
        calculateDeviationFromMean(groupedByUser);
        records = Array.from(groupedByUser.values()).flat();

        if(!isNaN(query.maxTimeDeviationFromUserMean)){
            records= records.filter(record => record.timeDeviation <= query.maxTimeDeviationFromUserMean);
        }
        if(!isNaN(query.maxTyposDeviationFromUserMean)){
            records= records.filter(record => record.typosDeviation <= query.maxTyposDeviationFromUserMean);
        }
    }

    if(query.minUserDataCount){
        const groupedByUser = groupByUser(records);
        const users = Array.from(groupedByUser.keys())
        for(let i = 0; i < users.length; ++i){
            if(groupedByUser.get(users[i]).length < query.minUserDataCount){
                groupedByUser.delete(users[i]);
            }
        }

        records = Array.from(groupedByUser.values()).flat();
    }

    if(query.minCompetitionDataCount){
        const groupedByCompetition = groupByCompetition(records);
        const competitions = Array.from(groupedByCompetition.keys())
        for(let i = 0; i < competitions.length; ++i){
            if(groupedByCompetition.get(competitions[i]).length < query.minCompetitionDataCount){
                groupedByCompetition.delete(competitions[i]);
            }
        }

        records = Array.from(groupedByCompetition.values()).flat();
    }

    if(!isNaN(query.limitRecordsPerUser)){
        // shuffle(records)
        const groupedByUser = groupByUser(records);
        groupedByUser.forEach(userRecords => userRecords.splice(query.limitRecordsPerUser) );

        records = Array.from(groupedByUser.values()).flat();
    }

    const numericFieds = ['finishDate', 'id', 'typos'];
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

export async function save(data, db){
    let close_db = false;
    if(!db){
        console.log("open db");
        close_db = true
        db = new AppDatabase(storageFilePath);
    }

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

    const dataInfo = await db.insertDataInfo(user_id, phrase_id, sequence_id, data.finishDate);

    if(close_db){
        await db.close();
    }

    return dataInfo?.id;
}

export async function saveMany(data){
    const db = new AppDatabase(storageFilePath);
    const ids = [];
    for(const d of data){
        const id = await save(d, db)
        ids.push(id);
    }

    
    await db.close();

    return ids;
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

    await db.close();

    return true;
}

export async function getAllUsernames(){
    const db = new AppDatabase(storageFilePath);
    const users = await db.getAllUsernames();

    await db.close();

    return users.map(user => user.username);
}

function checkSelectConditions(record, query){
    if(query.dateMin && record.finishDate < query.dateMin) return false;
    if(query.dateMax && record.finishDate > query.dateMax) return false;
    if(query.phrase && record.phrase != query.phrase) return false;
    if(query.users && !query.users.includes(record.user)) return false;
    if(query.maxTypingTime && record.typingTime > query.maxTypingTime) return false;
    if(!isNaN(query.maxTypos) && record.typos > query.maxTypos) return false;

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