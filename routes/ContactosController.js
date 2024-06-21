

require('dotenv').config();
const ContactosModel = require('./ContactosModel');
const nodemailer = require('nodemailer');

class ContactosController {
  constructor() {
    this.model = new ContactosModel();
    try {
      this.model.connect();
    } catch (err) {
      console.error('Error connecting to model:', err);
    }
  }

  async add(req, res) {
    try {
      const { correo, nombre, comentario } = req.body;
      if (!correo || !nombre || !comentario) {
        return res.status(400).send({ error: 'Missing required fields' });
      }

      const ip = req.headers['x-forwarded-for'] ?.split(',').shift() || req.socket?.remoteAddress;
      const url = 'http://ipwho.is/' + ip;
      const response = await fetch(url);
      const json = await response.json();
      const pais = json.country;

      const responseGoogle = req.body["g-recaptcha-response"];
      const secretGoogle ='6LdaS-8pAAAAALc4U8_4sCBm5jjhkYDw2-THUaqq';
      const urlGoogle = `https://www.google.com/recaptcha/api/siteverify?secret=${secretGoogle}&response=${responseGoogle}`;
      const RecaptchaGoogle = await fetch(urlGoogle, { method: "post", });
      const google_response_result = await RecaptchaGoogle.json();

      if (!google_response_result.success) {
        return res.status(400).send({ error: 'Invalid Recaptcha response' });
      }

      const hoy = new Date();
      const horas = hoy.getHours();
      const minutos = hoy.getMinutes();
      const hora = horas + ':' + minutos;
      const fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear() + '' + '/' + '' + hora;

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
        <h2>Información del Cliente</h2>
        <p>Email: ${correo}</p>
        <p>Nombre: ${nombre}</p>
        <p>Comentario: ${comentario}</p>
        <p>Fecha: ${fecha}</p>
        <p>IP: ${ip}</p>
        <pli>Pais: ${pais}</p>
      `;

      const receiver = {
        from: process.env.EMAIL,
        to: 'programacion2ais@dispostable.com',
        subject: 'Informacion del Contacto',
        html: customer
      };

      try {
        await transporter.sendMail(receiver);
        this.model.save(correo, nombre, comentario, ip, fecha, pais);
        res.send({ request: 'Formulario enviado' });
      } catch (err) {
        console.error('Error sending email:', err);
        res.status(500).send({ error: 'Error sending email' });
      }
    } catch (err) {
      console.error('Error processing request:', err);
      res.status(500).send({ error: 'Error processing request' });
    }
  }
}

module.exports = ContactosController