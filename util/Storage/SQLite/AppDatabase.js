import { SQLite_DB } from './sqlite';

const user_table = {
    table_name: "user",
    id_column: "id",
    username_column: "username",
    created_at_column: "created_at",
}

const phrase_table = {
    table_name: "phrase",
    id_column: "id",
    phrase_column: "phrase",
}

const data_info_table = {
    table_name: "data_info",
    id_column: "id",
    finish_date_column: "finish_date",
    user_id_column: "user_id",
    phrase_id_column: "phrase_id",
    sequence_id_column: "sequence_id",
}

const sequence_table = {
    table_name: "sequence",
    id_column: "id",
    sequence_column: "sequence",
}

const competition_table = {
    table_name: "competition",
    id_column: "id",
    teacher_column: "teacher",
    code_column: 'code',
    created_at_column: ' created_at',
    start_at_column: 'start_at',
    phrase_id_column: 'phrase_id',
    repetitions_column: 'repetitions', 
    end_at_column: 'end_at',
}

const data_competition_table = {
    table_name: "data_competition",
    data_info_id_column: "data_info_id",
    competition_id_column: "competition_id",
}

export class AppDatabase{

    #db;

    constructor(db_filename){
        this.#db = new SQLite_DB(db_filename);
    }

    /*
    * USERS
    */

    async createUserTable(){
        return this.#db.run(`CREATE TABLE IF NOT EXISTS ${user_table.table_name}(
            ${user_table.id_column} INTEGER PRIMARY KEY,
            ${user_table.username_column} VARCHAR,
            ${user_table.created_at_column} INTEGER
        );`)
    }

    async dropUserTable(){
        return this.#db.run(`DROP TABLE IF EXISTS ${user_table.table_name};`);
    }

    async getUsername(id){
        return this.#db.get(`SELECT ${user_table.username_column} FROM ${user_table.table_name} WHERE ${user_table.id_column} = ?;`, [id]);
    }

    async getAllUsernames(){
        return this.#db.all(`SELECT ${user_table.id_column}, ${user_table.username_column} FROM ${user_table.table_name};`);
    }

    // return user id based on the username. if user with given username exists, his or her id is returned, otherwise (if user with given username oes not exists) undefined is returned
    async getUserId(username){
        return this.#db.get(`SELECT ${user_table.id_column} FROM ${user_table.table_name} WHERE ${user_table.username_column} = ?;`, [username]);
    }

    async insertUser(username, created_at){
        return this.#db.get(`INSERT INTO ${user_table.table_name}(${user_table.username_column}, ${user_table.created_at_column}) VALUES(?, ?) RETURNING ${user_table.id_column};`, [username, created_at]);
    }

    async deleteUser(id){
        return this.#db.get(`DELETE FROM ${user_table.table_name} WHERE ${user_table.id_column} = ?`, [id]);
    }

    /*
    * PHRASES
    */

    async createPhraseTable(){
        return this.#db.run(`CREATE TABLE IF NOT EXISTS ${phrase_table.table_name}(
            ${phrase_table.id_column} INTEGER PRIMARY KEY,
            ${phrase_table.phrase_column} TEXT
        );`)
    }

    async dropPhraseTable(){
        return this.#db.run(`DROP TABLE IF EXISTS ${phrase_table.table_name};`);
    }

    async getPhrase(id){
        return this.#db.get(`SELECT ${phrase_table.phrase_column} FROM ${phrase_table.table_name} WHERE ${phrase_table.id_column} = ?`, [id]);
    }

    async getPhraseId(phrase){
        return this.#db.get(`SELECT ${phrase_table.id_column} FROM ${phrase_table.table_name} WHERE ${phrase_table.phrase_column} = ?`, [phrase]);
    }

    async insertPhrase(phrase){
        return this.#db.get(`INSERT INTO ${phrase_table.table_name}(${phrase_table.phrase_column}) VALUES(?) RETURNING ${phrase_table.id_column};`, [phrase]);
    }

    async deletePhrase(id){
        return this.#db.get(`DELETE FROM ${phrase_table.table_name} WHERE ${phrase_table.id_column} = ?`, [id]);
    }

    /*
    * SEQUENCES
    */

    async createSequenceTable(db){
        return this.#db.run(`CREATE TABLE IF NOT EXISTS ${sequence_table.table_name}(
            ${sequence_table.id_column} INTEGER PRIMARY KEY,
            ${sequence_table.sequence_column} TEXT
        );`);
    }

    async dropSequenceTable(db){
        return this.#db.run(`DROP TABLE IF EXISTS ${sequence_table.table_name};`);
    }

    async getSequence(id){
        return this.#db.get(`SELECT ${sequence_table.phrase_column} FROM ${sequence_table.table_name} WHERE ${sequence_table.id_column} = ?`, [id]);
    }

    async insertSequence(sequence){
        return this.#db.get(`INSERT INTO ${sequence_table.table_name}(${sequence_table.sequence_column}) VALUES(?) RETURNING ${sequence_table.id_column};`, [sequence]);
    }
    
    async deleteSequence(id){
        return this.#db.get(`DELETE FROM ${sequence_table.table_name} WHERE ${sequence_table.id_column} = ? RETURNING ${sequence_table.id_column};`, [id]);
    }

    /*
    * DATA INFO
    */

    async createDataInfoTable(){
        return this.#db.run(`CREATE TABLE IF NOT EXISTS ${data_info_table.table_name}(
            ${data_info_table.id_column} INTEGER PRIMARY KEY,
            ${data_info_table.user_id_column} INTEGER,
            ${data_info_table.phrase_id_column} INTEGER,
            ${data_info_table.sequence_id_column} INTEGER,
            ${data_info_table.finish_date_column} INTEGER,
            FOREIGN KEY(${data_info_table.user_id_column}) REFERENCES ${user_table.table_name}(${user_table.id_column}),
            FOREIGN KEY(${data_info_table.phrase_id_column}) REFERENCES ${phrase_table.table_name}(${phrase_table.id_column}),
            FOREIGN KEY(${data_info_table.sequence_id_column}) REFERENCES ${sequence_table.table_name}(${sequence_table.id_column})
        );`)
    }

    async dropDataInfoTable(){
        return this.#db.run(`DROP TABLE IF EXISTS ${data_info_table.table_name};`);
    }

    async getDataInfo(id){
        return this.#db.get(`SELECT * FROM ${data_info_table.table_name} WHERE ${data_info_table.id_column} = ?;`, [id]);
    }

    async getAllDataInfo(){
        return this.#db.all(`SELECT * FROM ${data_info_table.table_name};`);
    }

    async insertDataInfo(user_id, phrase_id, sequence_id, finish_date){
        return this.#db.get(`INSERT INTO ${data_info_table.table_name}(${data_info_table.user_id_column}, ${data_info_table.phrase_id_column}, ${data_info_table.sequence_id_column}, ${data_info_table.finish_date_column}) VALUES(?, ?, ?, ?) RETURNING ${data_info_table.id_column};`, [user_id, phrase_id,  sequence_id, finish_date]);
    }

    async deleteDataInfo(id){
        return this.#db.get(`DELETE FROM ${data_info_table.table_name} WHERE ${data_info_table.id_column} = ? RETURNING ${data_info_table.id_column};`, [id]);
    }

    /*
     *  MERGED DATA
     */

    async getAllUserInputData(){
        const fieldsToSelect = `di.${data_info_table.id_column}, di.${data_info_table.finish_date_column} as finishDate, u.${user_table.username_column} as user, p.${phrase_table.phrase_column}, s.${sequence_table.sequence_column}`;
        return this.#db.all(`SELECT ${fieldsToSelect} FROM ${data_info_table.table_name} di 
                        JOIN ${user_table.table_name} u ON di.${data_info_table.user_id_column} = u.${user_table.id_column}
                        JOIN ${phrase_table.table_name} p ON di.${data_info_table.phrase_id_column} = p.${phrase_table.id_column}
                        JOIN ${sequence_table.table_name} s ON di.${data_info_table.sequence_id_column} = s.${sequence_table.id_column};
            `);
    }

    async getUserInputData(id){
        const fieldsToSelect = `di.${data_info_table.id_column}, di.${data_info_table.finish_date_column} as finishDate, u.${user_table.username_column} as user, p.${phrase_table.phrase_column}, s.${sequence_table.sequence_column}`;
        return this.#db.get(`SELECT ${fieldsToSelect} FROM ${data_info_table.table_name} di 
                        JOIN ${user_table.table_name} u ON di.${data_info_table.user_id_column} = u.${user_table.id_column}
                        JOIN ${phrase_table.table_name} p ON di.${data_info_table.phrase_id_column} = p.${phrase_table.id_column}
                        JOIN ${sequence_table.table_name} s ON di.${data_info_table.sequence_id_column} = s.${sequence_table.id_column}
                        WHERE di.${data_info_table.id_column} = ?;
            `, [id]);
    }


    /*
     * COMPETITION
     */

    async createCompetitionTable(){
        return this.#db.run(`CREATE TABLE IF NOT EXISTS ${competition_table.table_name}(
            ${competition_table.id_column} INTEGER PRIMARY KEY,
            ${competition_table.code_column} VARCHAR,
            ${competition_table.teacher_column} VARCHAR,
            ${competition_table.created_at_column} INTEGER,
            ${competition_table.start_at_column} INTEGER,
            ${competition_table.end_at_column} INTEGER,
            ${competition_table.phrase_id_column} INTEGER,
            ${competition_table.repetitions_column} INTEGER,
            FOREIGN KEY(${competition_table.phrase_id_column}) REFERENCES ${phrase_table.table_name}(${phrase_table.id_column})
        );`)
    }

    async dropCompetitionTable(){
        return this.#db.run(`DROP TABLE IF EXISTS ${competition_table.table_name};`);
    }

    async getAllCompetitions(){
        return this.#db.all(`SELECT * FROM ${competition_table.table_name};`);
    }

    async getCompetition(id){
        const selectColumns = `c.${competition_table.id_column}, c.${competition_table.code_column}, c.${competition_table.teacher_column}, c.${competition_table.repetitions_column}, c.${competition_table.start_at_column}, c.${competition_table.end_at_column}, p.${phrase_table.phrase_column}`;
        return this.#db.get(`SELECT ${selectColumns} FROM ${competition_table.table_name} c
                            JOIN ${phrase_table.table_name} p ON c.${competition_table.phrase_id_column} = p.${phrase_table.id_column}
                            WHERE c.${competition_table.id_column} = ?;`, [id]);
    }

    async getCompetitionByCode(code){
        const selectColumns = `c.${competition_table.id_column}, c.${competition_table.code_column}, c.${competition_table.teacher_column}, c.${competition_table.repetitions_column}, c.${competition_table.start_at_column}, c.${competition_table.end_at_column}, p.${phrase_table.phrase_column}`;
        return this.#db.get(`SELECT ${selectColumns} FROM ${competition_table.table_name} c
                            JOIN ${phrase_table.table_name} p ON c.${competition_table.phrase_id_column} = p.${phrase_table.id_column}
                            WHERE c.${competition_table.code_column} = ?;`, [code]);
    }

    async insertCompetition(code, teacher, phrase_id,  repetitions, created_at, start_at, end_at){
        return this.#db.get(`INSERT INTO ${competition_table.table_name}(${competition_table.code_column}, ${competition_table.teacher_column}, ${competition_table.phrase_id_column}, ${competition_table.repetitions_column}, ${competition_table.created_at_column}, ${competition_table.start_at_column}, ${competition_table.end_at_column}) 
                            VALUES(?, ?, ?, ?, ?, ?, ?) RETURNING ${competition_table.id_column};`
                        , [code, teacher, phrase_id, repetitions, created_at, start_at, end_at]);
    }

    async deleteCompetition(id){
        return this.#db.get(`DELETE FROM ${competition_table.table_name} WHERE ${competition_table.id_column} = ? RETURNING ${competition_table.id_column};`, [id]);
    }


    /*
     *  COMPETITION PARTICIPATION
     */

    async createDataCompetitionTable(){
        return this.#db.run(`CREATE TABLE IF NOT EXISTS ${data_competition_table.table_name}(
            ${data_competition_table.data_info_id_column} INTEGER,
            ${data_competition_table.competition_id_column} INTEGER,
            FOREIGN KEY(${data_competition_table.data_info_id_column}) REFERENCES ${data_info_table.table_name}(${data_info_table.id_column}),
            FOREIGN KEY(${data_competition_table.competition_id_column}) REFERENCES ${competition_table.table_name}(${competition_table.id_column})
        );`)
    }

    async dropDataCompetitionTable(){
        return this.#db.run(`DROP TABLE IF EXISTS ${data_competition_table.table_name};`);
    }

    async linkDataWithCompetition(data_info_id, competition_id){
        return this.#db.get(`INSERT INTO ${data_competition_table.table_name}(${data_competition_table.data_info_id_column}, ${data_competition_table.competition_id_column}) VALUES(?, ?) RETURNING *;`, [data_info_id, competition_id]);
    }

    async getDataInfoForCompetition(competition_id){
        return this.#db.all(`SELECT * FROM ${data_competition_table.table_name} dc 
                            JOIN ${data_info_table.table_name} di 
                            ON dc.${data_competition_table.data_info_id_column} = di.${data_info_table.id_column} 
                            WHERE ${data_competition_table.competition_id_column} = ?;`
            , [competition_id]);
    }

    async getDataForCompetition(competition_id){
        const fieldsToSelect = `di.${data_info_table.id_column}, di.${data_info_table.finish_date_column} as finishDate, u.${user_table.username_column} as user, p.${phrase_table.phrase_column}, s.${sequence_table.sequence_column}`;
        return this.#db.all(`SELECT ${fieldsToSelect} FROM ${data_info_table.table_name} di 
                        JOIN ${user_table.table_name} u ON di.${data_info_table.user_id_column} = u.${user_table.id_column}
                        JOIN ${phrase_table.table_name} p ON di.${data_info_table.phrase_id_column} = p.${phrase_table.id_column}
                        JOIN ${sequence_table.table_name} s ON di.${data_info_table.sequence_id_column} = s.${sequence_table.id_column}
                        JOIN ${data_competition_table.table_name} dc ON di.${data_info_table.id_column} = dc.${data_competition_table.data_info_id_column}
                        WHERE dc.${data_competition_table.competition_id_column} = ? ORDER BY di.${data_info_table.finish_date_column} ASC;
            `, [competition_id]);
    }

    async getDataForUser(username){
        const fieldsToSelect = `di.${data_info_table.id_column}, di.${data_info_table.finish_date_column} as finishDate, u.${user_table.username_column} as user, p.${phrase_table.phrase_column}, s.${sequence_table.sequence_column}`;
        return this.#db.all(`SELECT ${fieldsToSelect} FROM ${data_info_table.table_name} di 
                        JOIN ${user_table.table_name} u ON di.${data_info_table.user_id_column} = u.${user_table.id_column}
                        JOIN ${phrase_table.table_name} p ON di.${data_info_table.phrase_id_column} = p.${phrase_table.id_column}
                        JOIN ${sequence_table.table_name} s ON di.${data_info_table.sequence_id_column} = s.${sequence_table.id_column}
                        WHERE u.${user_table.username_column} = ? ORDER BY di.${data_info_table.finish_date_column} ASC;
            `, [username]);
    }
}