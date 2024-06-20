require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contactosRouter = require('./routes/contactos');
var authRouter = require('./routes/auth'); // Nueva ruta para autenticación

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de la sesión
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Configuración de flash
app.use(flash());

// Middleware para hacer mensajes flash disponibles en todas las vistas
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Configuración de Passport
app.use(passport.initialize());
app.use(passport.session());

// Estrategia Local
const predefinedUser = process.env.PREDEFINED_USER;
const predefinedPass = process.env.PREDEFINED_PASS;

passport.use(new LocalStrategy(
  function(username, password, done) {
    if (username === predefinedUser && password === predefinedPass) {
      return done(null, { username: predefinedUser });
    } else {
      return done(null, false, { message: 'Usuario o contraseña incorrectos' });
    }
  }
));

// Configuración de la estrategia de Google OAuth
passport.use(new GoogleStrategy({
  clientID: 627081051338-nalj096im618i000j7ua3dekvvpiiq9e.apps.googleusercontent.com,
  clientSecret: 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,
  callbackURL: AIzaSyCOQzPfuULVYj2Yagm2K9hUGMqBmAXx-kE
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contactos', contactosRouter);
app.use('/auth', authRouter); // Usar las rutas de autenticación

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
