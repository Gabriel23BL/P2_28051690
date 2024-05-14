var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

const sqlite = require("sqlite3");
let sql="";

const db = new sqlite.Database('./data.db', sqlite.OPEN_READWRITE, (error) =>{
  if(error){
    console.error(error);
  }
});
sql = `CREATE TABLE IF NOT EXISTS contactos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(50) NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  comentario TEXT,
  ip TEXT NOT NULL,
  fecha_hora TEXT
)`;
db.run(sql, (error) => {
  if(error){
    console.error(error);
  }
});

