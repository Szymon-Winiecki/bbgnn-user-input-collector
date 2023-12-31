const sqlite3 = require('sqlite3').verbose();

// Promises wrapper for sqlite3 callabck API
export class SQLite_DB
{
    #db;

    constructor(filename){
        this.#db = new sqlite3.Database(filename, (err) => {
            if (err) {
                throw new Error(err.message);
            }
        });
    }

    close(){
        return new Promise((resolve, reject) => {
            this.#db.close((err) => {
                if (err) {
                    reject(err.message);
                }
              });
            resolve(true)
        });
    }

    run(query, params = []){
        return new Promise((resolve, reject) => {
            this.#db.run(query, params, (err) => {
                if (err) {
                    reject(err.message);
                }
                resolve(true)
              });
        });
    }

    get(query, params = []){
        return new Promise((resolve, reject) => {
            this.#db.get(query, params, (err, row) => {
                if (err) {
                    reject(err.message);
                }
                resolve(row)
              });
        });
    }

    all(query, params = []){
        return new Promise((resolve, reject) => {
            this.#db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err.message);
                }
                resolve(rows)
              });
        });
    }
}
