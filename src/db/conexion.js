const sqlite3 = require('sqlite3');

class DB {
    static #db;

    static open() {
        if (this.#db == undefined) {
            this.#db = new sqlite3.Database('./curriculum.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_FULLMUTEX, (errror) => {
                if (errror) {
                    console.error(errror.message);
                } else {
                    console.log('Conexion exitosa...');
                }
            })
        }
        return this.#db;        
    }

    static close() {
        if (this.#db != undefined) {
            this.#db.close();
        }
    }
}

module.exports = DB;