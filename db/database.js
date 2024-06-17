const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Establece la ruta de la base de datos
const databasePath = path.join(__dirname, '../db/database.db');

const db = new sqlite3.Database(databasePath);

// Crear la tabla "usuarios" si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    correo TEXT,
    nombre TEXT,
    comentario TEXT
  )
`);

//agregar campo token, clave, pais, fecha_registro

module.exports = db;