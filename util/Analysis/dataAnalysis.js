import { getErrorsCount } from "./phraseAnalysis";
import { getTypingTime, retrieveEnteredPhrase } from "./sequenceAnalysis";


export function calculateAdditionalInfo(records){
    records.forEach(record => {
        record.retypedPhrase = retrieveEnteredPhrase(record.sequence);
        record.typos = getErrorsCount(record.phrase, record.retypedPhrase);
        record.typingTime = getTypingTime(record.sequence);
    });

    return records;
}

export function groupByUser(records){
    const users = new Map();

    records.forEach(record => {
        if(!users.has(record.user)){
            users.set(record.user, []);
        }
        users.get(record.user).push(record);
    });

    return users;
}

export function groupByCompetition(records){
    const competitions = new Map();

    records.forEach(record => {
        let competition = 'none'
        const usernameParts = record.user.split('_');
        if(usernameParts.length == 3){
            competition = usernameParts[0];
        }
        if(!competitions.has(competition)){
            competitions.set(competition, []);
        }
        competitions.get(competition).push(record);
    });

    return competitions;
}

export function calculateDeviationFromMean(groupedRecords){
    groupedRecords.forEach( (records) => {
        let time = 0;
        let typos = 0;

        records.forEach(record => {
            time += record.typingTime;
            typos += record.typos;
        });

        time /= records.length;
        typos /= records.length;

        records.forEach(record => {
            record.timeDeviation = Math.abs(record.typingTime - time) / time;
            record.typosDeviation = Math.abs(record.typos - typos) / typos;
        });
    });

    return groupedRecords;
}