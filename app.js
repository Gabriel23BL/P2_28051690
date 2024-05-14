var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// Obtener el formulario
const contactForm = document.getElementById('contactForm');

// Agregar el evento submit al formulario
contactForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente

    // Obtener los valores de los campos del formulario
    const email = document.getElementById('email').value;
    const nombre = document.getElementById('nombre').value;
    const comentario = document.getElementById('comentario').value;

    // Validar los datos del formulario
    if (email && nombre && comentario) {
        // Crear un objeto con los datos del formulario
        const formData = {
            email: email,
            nombre: nombre,
            comentario: comentario
        };

        // Enviar los datos del formulario al servidor (puedes hacerlo usando fetch, por ejemplo)
        // Aquí puedes llamar a la clase ContactosController para guardar los datos en la base de datos

        // Redireccionar al usuario a una página de confirmación o mostrar un mensaje de éxito
        alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
        contactForm.reset(); // Limpiar el formulario
    } else {
        alert('Por favor, completa todos los campos del formulario.');
    }
});

const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

class ContactosModel {
    constructor() {
        ContactosController.sql = new sqlite3.Database('database.db'); 
    }

    connect() {
        this.db.serialize(() => { 
            ContactosController.sql.run(`
                CREATE TABLE IF NOT EXISTS controllercontactos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT,
                    nombre TEXT,
                    comentario TEXT,
                    ip TEXT,
                    fecha_hora TEXT
                )
            `);
        });
    }

    guardarContacto(contacto) {
        const { email, nombre, comentario, ip, fecha_hora } = contacto;
       ContactosController.sql.run(`
            INSERT INTO contactos (email, nombre, comentario, ip, fecha_hora)
            VALUES (?, ?, ?, ?, ?)
        `, [email, nombre, comentario, ip, fecha_hora]);
    }

    obtenerContactos(callback) {
        this.db.all('SELECT * FROM contactos', callback);
    }
}

class ContactosController {
    constructor() { 
       this.contactosModel.connect(); 
   }

   validarFormulario(contacto) { 
       // Agrega aquí tu lógica de validación del formulario 
   }
}