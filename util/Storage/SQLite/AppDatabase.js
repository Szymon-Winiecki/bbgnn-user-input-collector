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
        return this.#db.get(`DELETE FROM ${sequence_table.table_name} WHERE ${sequence_table.id_column} = ?`, [id]);
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
        return this.#db.get(`DELETE FROM ${data_info_table.table_name} WHERE ${data_info_table.id_column} = ?`, [id]);
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
}