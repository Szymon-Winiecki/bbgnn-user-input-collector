import { AppDatabase } from "./AppDatabase";
import { storageFilePath } from "./common";
import * as dataStorage from './collectedInputDataStorage'

export async function getCompetition(id){
    const db = new AppDatabase(storageFilePath);

    const competition = await db.getCompetition(id);

    if(!competition){
        return false;
    }
    return competition;
}

export async function getCompetitionByCode(code){
    const db = new AppDatabase(storageFilePath);
    return await db.getCompetitionByCode(code);
}

export async function getAllCompetitions(){
    const db = new AppDatabase(storageFilePath);

    const competitions = await db.getAllCompetitions();

    return competitions;
}

export async function getDataInfoForCompetition(id){
    const db = new AppDatabase(storageFilePath);

    const competitions = await db.getDataInfoForCompetition(id);

    return competitions;
}

export async function getDataForCompetition(id){
    const db = new AppDatabase(storageFilePath);

    const data = await db.getDataForCompetition(id);

    data.forEach(row => {
        row.sequence = JSON.parse(row.sequence);
    });

    return data;
}

export async function createCompetition(code, teacher, phrase, repetitions, created_at, start_at, end_at){
    const db = new AppDatabase(storageFilePath);

    let phrase_id = await db.getPhraseId(phrase);
    if(phrase_id == undefined){
        phrase_id = await db.insertPhrase(phrase);
    }
    phrase_id = phrase_id.id;

    const competition = await db.insertCompetition(code, teacher, phrase_id, repetitions, created_at, start_at, end_at);

    if(!competition){
        return false;
    }
    return competition.id;
}

export async function linkDataWithCompetition(data_id, competition_id){
    const db = new AppDatabase(storageFilePath);
    return await db.linkDataWithCompetition(data_id, competition_id);
}

export async function saveDataInCompetition(data, competition_id){
    const id = await dataStorage.save(data);
    return await linkDataWithCompetition(id, competition_id);
}

export async function getDataForUser(username){
    const db = new AppDatabase(storageFilePath);
    const rows = await db.getDataForUser(username);
    rows.forEach(row => {
        row.sequence = JSON.parse(row.sequence);
    });
    return rows;
}