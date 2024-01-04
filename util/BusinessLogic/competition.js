import * as storage from '../Storage/SQLite/competition';
import * as dataStorage from '../Storage/SQLite/collectedInputDataStorage';
import { randomAlphanumString } from '../utilityHelper';
import { getTypingTime, retrieveEnteredPhrase } from '../Analysis/sequenceAnalysis';
import { getErrorsCount } from '../Analysis/phraseAnalysis';

export async function getAll(){
    return await storage.getAllCompetitions();
}

export async function get(id){
    return await storage.getCompetition(id);
}

export async function getByCode(code){
    return await storage.getCompetitionByCode(code);
}

export async function create(competition){
    const code = await getNewCode();
    if(code == null){
        throw new Error('Failed to generate a unique code');
    }
    return await storage.createCompetition(code, competition.teacher, competition.phrase, competition.repetitions, Date.now(), competition.start_at, competition.end_at);
}

export async function getDataInfoForCompetition(id){
    return await storage.getDataInfoForCompetition(id);
}

export async function linkDataWithCompetition(data_id, competition_id){
    return await storage.linkDataWithCompetition(data_id, competition_id);
}

export async function saveDataInCompetition(data, competition_id){
    return await storage.saveDataInCompetition(data, competition_id);
}

export async function getStats(data_id){
    const data = await dataStorage.read(data_id);
    if(!data){
        return null;
    }

    return {
        time: getTypingTime(data.sequence),
        typos: getErrorsCount(data.phrase, retrieveEnteredPhrase(data.sequence)),
    }
}

export async function getResultsForUser(username){
    const data = await storage.getDataForUser(username);
    const results = [];
    data.forEach(d => {
        const time = getTypingTime(d.sequence);
        const typos = getErrorsCount(d.phrase, retrieveEnteredPhrase(d.sequence));
        const score = time / 1000 + typos * 0.5;
        results.push({
            time: time,
            typos: typos,
            score: score,
        })
    });

    return results;
}

export async function getResultsForCompetitions(competition_id){
    const data = await storage.getDataForCompetition(competition_id);
    const results = [];
    data.forEach(d => {
        const time = getTypingTime(d.sequence);
        const typos = getErrorsCount(d.phrase, retrieveEnteredPhrase(d.sequence));
        const score = time / 1000 + typos * 0.5;
        const username_parts = d.user.split('_');
        results.push({
            username: d.user,
            studentNumber: username_parts[2],
            classNumber: username_parts[1],
            time: time,
            typos: typos,
            score: score,
        })
    });

    let topResults = new Map();

    results.forEach(r => {
        if(!topResults.has(r.username)){
            topResults.set(r.username, {
                count: 0,
                result: r,
            })
        }

        const t = topResults.get(r.username);
        t.count++;
        if(t.result.score > r.score){
            t.result = r;
        }
    });

    topResults = Array.from(topResults.values());

    topResults.sort((a, b) => a.result.score - b.result.score);
    return topResults;
}

const CODE_LENGTH = 8;
async function getNewCode(){
    let code = randomAlphanumString(CODE_LENGTH);
    let t = 50;
    while((await storage.getCompetitionByCode(code)) != undefined){
        if(t-- == 0){
            return null;
        }
        code = randomAlphanumString(CODE_LENGTH);
    }
    return code;
}