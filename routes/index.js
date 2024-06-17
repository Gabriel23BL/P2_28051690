var express = require('express');
var router = express.Router();
var ControladorUsuario = require('../Controller/Controller.Usuario')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/usuario', ControladorUsuario.guardarUsuario);

//router.get('/validar/token', ControladorUsuario.validar);
//router.get('/validar/:token', ControladorUsuario.validar);

module.exports = router;
