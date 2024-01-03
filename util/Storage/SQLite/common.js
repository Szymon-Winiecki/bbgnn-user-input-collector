import * as fs from 'fs';
import * as path from 'path';

import { AppDatabase } from './AppDatabase';

const STORAGE_ROOT_DIRECTORY = 'Storage/SQLite/CollectedInputData/';
const STORAGE_FILE_NAME = 'Data.db';

export const storageFilePath = path.join(STORAGE_ROOT_DIRECTORY, STORAGE_FILE_NAME);

export async function initStorage(){
    fs.mkdirSync(STORAGE_ROOT_DIRECTORY, {recursive: true});
    
    if(!fs.existsSync(storageFilePath)){
        const db = new AppDatabase(storageFilePath);

        await db.createUserTable();
        await db.createPhraseTable();
        await db.createSequenceTable();
        await db.createDataInfoTable();
        await db.createCompetitionTable();
        await db.createDataCompetitionTable();
    }
    else{
        console.error("Init failed, database exists.");
    }
}

export async function resetStorage(){
    if(fs.existsSync(storageFilePath)){
        const db = new AppDatabase(storageFilePath);

        await db.dropDataCompetitionTable();
        await db.dropCompetitionTable();
        await db.dropDataInfoTable();
        await db.dropUserTable();
        await db.dropPhraseTable();
        await db.dropSequenceTable();

        await db.createUserTable();
        await db.createPhraseTable();
        await db.createSequenceTable();
        await db.createDataInfoTable();
        await db.createCompetitionTable();
        await db.createDataCompetitionTable();
    }
}