var express = require('express');
var router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const path = require('path');

class ContactosModel{
  constructor(){
    const dbR = path.join(__dirname, "/database", "dbAdmin.db");
    this.db = new sqlite3.Database(dbR, (err) => {
      let question = err ? 'Error' : 'Base de datos creada correctamente.';
      console.log(question);
    });
  }

  connect(){
    this.db.run('CREATE TABLE IF NOT EXISTS contactos(correo VARCHAR(255), nombre VARCHAR(255), comentario TEXT,ip TEXT,fecha TEXT)');
}
  
  save(correo,nombre,comentario,ip,fecha){
    this.db.run("INSERT INTO contactos VALUES (?, ?, ?, ?, ?)", [correo, nombre, comentario, ip, fecha]);
  }

}


class ContactosController{
  constructor(){
    this.model = new ContactosModel();
    this.model.connect();
    
  }

  add(req,res){
    const correo = req.body.correo;
    const nombre = req.body.nombre;
    const comentario = req.body.comentario;
    console.log(req.body)
    /*Ip address*/
    const ip = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;

    /*Fecha y hora*/
    let hoy = new Date();
	  let horas = hoy.getHours();
	  let minutos = hoy.getMinutes();
	  let hora = horas + ':' + minutos;
	  let fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear() + '' + '/' + '' + hora;
    this.model.save(correo,nombre,comentario,ip,fecha);
    res.send('Formulario enviado')
  }
}

const controller = new ContactosController();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/send', (req, res) => controller.add(req, res));

module.exports = router;
