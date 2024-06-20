const ContactosModel = require("../models/ContactosModel");
const nodemailer = require('nodemailer');
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_DESTINO1 = process.env.EMAIL_DESTINO1;

class ContactosController {
  constructor() {
    this.contactosModel = new ContactosModel();
    this.add = this.add.bind(this);
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });
  }


   enviarCorreo(email, name, mensaje, EMAIL_USER, EMAIL_DESTINO1) {
    const mailOptions = {
      from: EMAIL_USER,
      to: EMAIL_DESTINO1,
      subject: 'Nuevo registro de usuario',
      text: 'Nombre: '+name+'\nEmail: '+email+'\nMensaje: '+mensaje
    };
    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Correo enviado');
      }
    });
  }



  async obtenerIp() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip; // Retorna la ip
    } catch (error) {
      console.error('Error al obtener la ip:', error);
      return null; // Retorna null si hay un error
    }
  }

  async obtenerPais(ip) {
    try {
      const response = await fetch('https://ipinfo.io/'+ip+'?token=1bf6a20a980ccf');
      const data = await response.json();
      return data.country; // Retorna el país
    } catch (error) {
      console.error('Error al obtener el país:', error);
      return null; // Retorna null si hay un error
    }
  }

  
  
  async add(req, res) {
    // Validar los datos del formulario
      const { name, email, mensaje } = req.body;
  
  

    // Guardar los datos del formulario
    const ip = await this.obtenerIp();
    const fecha = new Date().toISOString();
    const pais = await this.obtenerPais(ip);

      await this.contactosModel.crearContacto(email, name, mensaje, ip, fecha, pais);

      const contactos = await this.contactosModel.obtenerAllContactos();

      await this.enviarCorreo(email, name, mensaje, EMAIL_USER, EMAIL_DESTINO1);
  
      console.log(contactos);
  
      // Enviar mensaje de confirmacion
      res.send("Tu mensaje fue enviado con exito, Se ha enviado un correo electrónico de confirmación.");
    }
  }

module.exports = ContactosController;