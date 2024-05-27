/** Aqui importamos del modelo toda la clase que en este caso es usuario, esto con
el fin de utilizar todos los metodos que tiene la clase */
const Usuario = require("../Model/Usuario.Modelo.js");

class ControladorUsuario {
  static async guardarUsuario(req, res) {
    try {
      const { correo, nombre, comentario, ip, fecha } = req.body;

      const usuario = await Usuario.registrar(correo, nombre, comentario, ip, fecha);
      if (usuario) {
        res.status(201).send({
          status: "ok",
          codigo: 201,
          message: "Registro exitoso...",
        });
      } else {
        res.status(500).send({
          status: "error",
          codigo: 500,
          message: "Fallo al registrar...",
        });
      }
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  }
}

module.exports = ControladorUsuario;
