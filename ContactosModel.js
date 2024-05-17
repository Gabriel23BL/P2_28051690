const sqlite3 = require("sqlite3").verbose();
const { error } = require("console");
const { promisify } = require("util");

class ContactosModel {
  constructor() {

    this.db = new sqlite3.Database("./data.db", (error) => {
      if (error) {
        console.error(error.message);
        return
      }
      console.log("Conectado a la base de datos SQLite.");
    });

    this.db.run(
      "CREATE TABLE IF NOT EXISTS contactos (email VARCHAR(20), nombre VARCHAR(20), comentario VARCHAR(50), ip TEXT, fecha DATE, id INTEGER PRIMARY KEY AUTOINCREMENT)",
      (error) => {
        if (error) {
          console.error(err.message);
        }
      }
    );
  }

  crearContacto(email, nombre, mensaje, ip, fecha) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO contactos (email, nombre, comentario, ip, fecha) VALUES (?, ?, ?, ?, ?)`;
      this.db.run(sql, [email, nombre, comentario, ip, fecha], function (err) {
        if (error) {
          console.error(error.message);
          reject(error);
        }
        console.log(`Se ha insertado una fila con el ID ${this.lastID}`);
        resolve(this.lastID);
      });
    });
  }

  async obtenerContacto(email) {
    const sql = `SELECT * FROM contactos WHERE email = ?`;
    const get = promisify(this.db.get).bind(this.db);
    return await get(sql, [email]);
  }

  async obtenerAllContactos() {
    const sql = `SELECT * FROM contactos`;
    const all = promisify(this.db.all).bind(this.db);
    return await all(sql);
  }
}

module.exports = ContactosModel;
