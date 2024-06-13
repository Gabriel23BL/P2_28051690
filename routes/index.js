var express = require('express');
var router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const nodemailer = require('nodemailer');
const path = require('path');

require('dotenv').config();

// script.js
const clientId = '627081051338-nalj096im618i000j7ua3dekvvpiiq9e.apps.googleusercontent.com';

const redirectUri = 'AIzaSyCOQzPfuULVYj2Yagm2K9hUGMqBmAXx-kE';
const scope = 'programacion2ais@dispostable.com';

const googleSigninBtn = document.getElementById('google-signin-btn');

googleSigninBtn.addEventListener('click', () => {
  const authUrl = 'https://accounts.google.com/o/oauth2/auth?+client_id=${clientId}&+redirect_uri=${redirectUri}&+scope=${scope}&+response_type=code';
   window.location.href = authUrl;
});

// Función para manejar la respuesta de la autenticación
function handleAuthResponse() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const error = urlParams.get('error');
  if (error) {
    console.error('Error de autenticacion: error')
  } else {
    // Intercambiar el código por un token de acceso
    fetch('https://oauth2.googleapis.com/token',
    {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: 'grant_type=authorization_code&+code=${code}&+redirect_uri=${redirectUri}&+client_id=${clientId}&+client_secret=YOUR_CLIENT_SECRET'})
      .then(response => response.json())
     .then(data => {
        const accessToken = data.access_token;
        // Llamar a la API de Google para obtener la información del perfil
        fetch('https://openidconnect.googleapis.com/v1/userinfo?access_token=${accessToken}')
         .then(response => response.json())
         .then(data => {
            const profileDiv = document.getElementById('profile');
            profileDiv.innerHTML = 'Bienvenido, ${data.name}!'
          });
        });
  }}

// Llamar a la función para manejar la respuesta de la autenticación
handleAuthResponse();



class ContactosModel {
  constructor() {
    const dbR = path.join(__dirname, "/database", "reqistrados.db");
    this.db = new sqlite3.Database(dbR, (err) => {
      let question = err ? 'Error' : ' La Base De Datos Fue Creada Correctamente.';
      console.log(question);
    });
  }
    connect() {
      this.db.run('CREATE TABLE IF NOT EXISTS contactos(correo VARCHAR(255), nombre VARCHAR(255), comentario TEXT,ip TEXT,fecha DATE,pais TEXT)');
   }
      save(correo, nombre, comentario, ip, fecha, pais) {
        this.db.run("INSERT INTO contactos VALUES (?, ?, ?, ?, ?,?)", [correo, nombre, comentario, ip, fecha, pais]);
      }
}

/*modelo de contactos*/

class ContactosController {
  constructor() {
    this.model = new ContactosModel();
    this.model.connect();
  }

  async add(req, res) {
    const correo = req.body.correo;
    const nombre = req.body.nombre;
    const comentario = req.body.comentario;
    console.log(req.body)

      /*Ip address*/
     const ip = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;

     const url = 'http://ipwho.is/' + ip;

     const response = await fetch(url);

     const json = await response.json();

     const pais = json.country

      /*recaptcha */
      const responseGoogle = req.body["g-recaptcha-response"];

      const secretGoogle ='6LdaS-8pAAAAALc4U8_4sCBm5jjhkYDw2-THUaqq';

      const urlGoogle = `https://www.google.com/recaptcha/api/siteverify?secret=${secretGoogle}&response=${responseGoogle}`;

      const RecaptchaGoogle = await fetch(urlGoogle, { method: "post", });

      const google_response_result = await RecaptchaGoogle.json();
      console.log(google_response_result)
    if (google_response_result.success == true) {
      
      /*los datos de la fecha y la hora*/
      let hoy = new Date();
      let horas = hoy.getHours();
      let minutos = hoy.getMinutes();
      let hora = horas + ':' + minutos;
      let fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear() + '' + '/' + '' + hora;
      let transporter = nodemailer.createTransport({
          host: "smtp-mail.outlook.com",
          secureConnection: false,
          port: 587,
          tls: {
            ciphers: 'SSLv3'
          },
         auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
          }
      });
        const customer = `
						    <h2>Información del Cliente</h2> <p>Email: ${correo}</p> <p>Nombre: ${nombre}</p> <p>Comentario: ${comentario}</p> <p>Fecha: ${fecha}</p> <p>IP: ${ip}</p> <pli>Pais: ${pais}</p> `;


      const receiver = {
        from: process.env.EMAIL,
        to: 'programacion2ais@dispostable.com',
        subject: 'Informacion del Contacto',
        html: customer
      };
      transporter.sendMail(receiver, (err, info) => {
        if (err) {
          console.log(err)
        }
        else {
          this.model.save(correo, nombre, comentario, ip, fecha, pais);
          res.send('El Formulario Fue Enviado Con Exito');
        }
      })
    } else {
      res.send('Verifica El Captcha Para Avanzar')
    }
  }
}
const controller = new ContactosController();

/* GET inicio de pagina. */
router.get('/', function (req, res, next) {
  res.render('index', { 
    title: 'Express',
    KEYPUBLIC: process.env.KEY_PUBLIC
  });
});
router.post('/send', async (req, res) => controller.add(req, res));

module.exports = router;
