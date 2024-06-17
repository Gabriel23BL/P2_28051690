/** Aqui importamos del modelo toda la clase que en este caso es usuario, esto con
el fin de utilizar todos los metodos que tiene la clase */
const Usuario = require("../Model/Usuario.Modelo.js");

class ControladorUsuario {
  static async guardarUsuario(req, res) {
    try {
      const { correo, nombre, comentario } = req.body;

      //funcion que genere token tiene que retornar un valor
      //const token = funcion

      //funcion llemando el ip para tener el nombre del pais
      //const usuario = await Usuario.registrar(correo, nombre, comentario, token, pais);

      //funcion de enviar token al correo
      //lo que llega al correo es algo asi:
      //https://mi-dominio/validar/token

      const usuario = await Usuario.registrar(correo, nombre, comentario);
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

  /**
  static async validar(req, res) {
    const { url } = req.url;

    //const valida = await Modelo.validarUsuario(url);
    if (valida) {
      res.send({
        status: 'ok',
        message: 'Validado con exito'
      })
    } else {
      res.send({
        status: 'error',
        message: 'Error al validar'
      })
    }
  }
  */

}

module.exports = ControladorUsuario;
