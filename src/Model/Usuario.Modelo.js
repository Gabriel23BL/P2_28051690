//Aqui importamos el archivo de crear la base de datos
const db = require("../db/database.js");

/** Esta clase se utiliza para guardar los metodos o funciones realcionadas
 al usuario o como quieras llamar la clase*/
class Usuario {
  static async registrar(correo, nombre, comentario) {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO usuarios (correo, nombre, comentario) VALUES (?, ?, ?)",
        [correo, nombre, comentario],
        function (err) {
          if (!err) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    });
  }

  /**
  static async obtenerTodos() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM usuarios', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
   */
}

module.exports = Usuario;
