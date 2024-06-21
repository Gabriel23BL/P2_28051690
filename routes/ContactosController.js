
const ContactosModel = require('./ContactosModel');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const recaptcha = require('recaptcha-v2');

dotenv.config();

class ContactosController {
  constructor() {
    this.model = new ContactosModel();
    this.model.connect();
  }

  async add(req, res) {
    const correo = req.body.correo;
    const nombre = req.body.nombre;
    const comentario = req.body.comentario;
    console.log(req.body);

    /* Ip address */
    const ip = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;
    const url = 'http://ipwho.is/' + ip;
    const response = await fetch(url);
    const json = await response.json();
    const pais = json.country;

    const ContactosController = {
      add: async (req, res) => {
      const responseGoogle = req.body["g-recaptcha-response"];
       const secretGoogle = '6LdaS-8pAAAAALc4U8_4sCBm5jjhkYDw2-THUaqq';
       try {
        const response = await recaptcha.verify(recaptchaResponse, secretKey);
        if (!response.success) {
          return res.status(400).json({ error: 'ReCaptcha inválido' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  

      // Procesar la solicitud
       const urlGoogle = `https://www.google.com/recaptcha/api/siteverify?secret=${secretGoogle}&response=${responseGoogle}`;
       const RecaptchaGoogle = await fetch(urlGoogle, { method: "post", });
       const google_response_result = await RecaptchaGoogle.json();
       console.log(google_response_result);

    if (google_response_result.success === true) {
      /* Fecha y hora */
      let hoy = new Date();
      let horas = hoy.getHours();
      let minutos = hoy.getMinutes();
      let hora = horas + ':' + minutos;
      let fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear() + '' + '/' + '' + hora;

      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    
    if (email.includes('@outlook.com')) {
        process.env.EMAIL_HOST = 'smtp-mail.outlook.com';
        process.env.EMAIL_PORT = 587;
        process.env.EMAIL_SECURE = false;
    } else if (email.includes('@gmail.com')) {
        process.env.EMAIL_HOST = 'smtp.gmail.com';
        process.env.EMAIL_PORT = 587;
        process.env.EMAIL_SECURE = false;
    }

      const customer = `
        <h2>Información del Cliente</h2>
        <p>Email: ${correo}</p>
        <p>Nombre: ${nombre}</p>
        <p>Comentario: ${comentario}</p>
        <p>Fecha: ${fecha}</p>
        <p>IP: ${ip}</p>
        <p>Pais: ${pais}</p>
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
        console.error('Error enviando correo electrónico:', err);
        res.status(500).send({ error: 'Error enviando correo electrónico' });
      }
    } else {
      res.send({ request: 'Verifica el captcha para avanzar' });
    }
  }
}
}
};
module.exports = ContactosController;