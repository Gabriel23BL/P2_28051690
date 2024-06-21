require('dotenv').config();
const sqlite3 = require('sqlite3');
const path = require('path');



class ContactosModel {
  constructor() {
    const dbR = path.join(__dirname, "/database", "dbAdmin.db");
    this.db = new sqlite3.Database(dbR, (err) => {
      let question = err ? 'Error' : 'Base de datos creada correctamente.';
      console.log(question);
    });
  }

  connect() {
    this.db.run('CREATE TABLE IF NOT EXISTS contactos(correo VARCHAR(255), nombre VARCHAR(255), comentario TEXT,ip TEXT,fecha TEXT,pais TEXT)');
  }

  save(correo, nombre, comentario, ip, fecha, pais) {

    this.db.run("INSERT INTO contactos VALUES (?, ?, ?, ?, ?,?)", [correo, nombre, comentario, ip, fecha, pais]);
  }

  getContacts() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM contactos", [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
    })
  }
}


module.exports = ContactosModel