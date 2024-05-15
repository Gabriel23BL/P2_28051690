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


//sql
const sqlite = require("sqlite3");
const db = new sqlite.Database('./data.db', sqlite.OPEN_READWRITE, (error) => {
  if (error) {
    console.error(error);
  }
});

const createTableQuery = `CREATE TABLE IF NOT EXISTS contactos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(50) NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  comentario TEXT,
  ip TEXT NOT NULL,
  fecha_hora TEXT
)`;

db.run(createTableQuery, (error) => {
  if (error) {
    console.error(error);
  }
});

const insertQuery = `INSERT INTO contactos (email, nombre, comentario, ip, fecha_hora) VALUES (?, ?, ?, ?, ?)`;

const email = "example@example.com";
const nombre = "Gabriel";
const comentario = "Este es un comentario";
const ip = "127.0.0.1";
const fecha_hora = new Date().toISOString();

db.run(insertQuery, [email, nombre, comentario, ip, fecha_hora], function (error) {
  if (error) {
    console.error(error.message);
  } else {
    console.log(`Contacto con ID ${this.lastID} guardado correctamente`);
  }
});

db.close((error) => {
  if (error) {
    console.error(error);
  }
});
