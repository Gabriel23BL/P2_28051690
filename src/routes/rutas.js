const express = require("express");
const ControladorUsuario = require("../Controller/Controller.Usuario.js");

const rutas = express.Router();

//Esta es la ruta Raiz
rutas.get("/", (req, res) => {
  res.render("index");
});

//Esta es solo una ruta para guardar los datos
rutas.post("/api/registro", ControladorUsuario.guardarUsuario);

module.exports = rutas;
