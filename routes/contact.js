var contactRouter = require('./routes/contact');

app.use('/contact', contactRouter);
var express = require('express');
var router = express.Router();
const sqlite = require("sqlite3");
const db = new sqlite.Database('./data.db', sqlite.OPEN_READWRITE, (error) => {
  if (error) {
    console.error(error);
  }
});

router.post('/', function(req, res, next) {
  const { email, nombre, comentario } = req.body;
  const ip = req.ip;
  const fecha_hora = new Date().toISOString();

  const insertQuery = `INSERT INTO contactos (email, nombre, comentario, ip, fecha_hora) VALUES (?, ?, ?, ?, ?)`;

  db.run(insertQuery, [email, nombre, comentario, ip, fecha_hora], function (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send("Error al guardar el contacto en la base de datos");
    } else {
      console.log(`Contacto con ID ${this.lastID} guardado correctamente`);
      res.status(200).send("Contacto guardado correctamente");
    }
  });
});

module.exports = router;