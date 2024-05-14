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
const { error } = require('console');
let sql="";

const db = new sqlite.Database('./data.db', sqlite.OPEN_READWRITE, (error) =>{
  if(error){
    console.error(error);
  }
});
sql= `CREATE TABLE IF NOT EXISTS contactos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(50) NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  comentario TEXT,
  ip TEXT NOT NULL,
  fecha_hora TEXT
)`;
db.run(sql, (error) => {
  if(error){
    console.error(error);
  }
});

sql= `INSERT INTO contactos (email, nombre, comentario, ip, fecha) VALUES (?, ?, ?, ?, ?),
`;


