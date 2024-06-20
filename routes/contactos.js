var express = require('express');
var router = express.Router();
var ContactosModel = require('../models/ContactosModel'); // Importa el modelo de Contactos

// Instancia del modelo de contactos
const contactosModel = new ContactosModel();

// Middleware para verificar la autenticación
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Debes iniciar sesión para ver esta página.');
  res.redirect('/auth/login');
}

// Ruta de contactos protegida
router.get('/', ensureAuthenticated, async (req, res, next) => {
  try {
    const contactos = await contactosModel.obtenerAllContactos();
    res.render('contactos', { data: contactos }); // Renderiza la vista con los datos obtenidos
  } catch (err) {
    console.error('Error al obtener los contactos:', err);
    req.flash('error_msg', 'Ocurrió un error al obtener los contactos.');
    res.redirect('/');
  }
});

module.exports = router;



