require('dotenv').config();
const express = require('express');
const router = express.Router();
const ContactosController = require('./ContactosController');
const AuthProtect = require('./Auth');
const controller = new ContactosController();
const passport = require('passport');
const jwt = require('jsonwebtoken');

AuthProtect.Passport();

router.get('https://p2-28051690.onrender.com/github', passport.authenticate('github'));
router.get('https://p2-28051690.onrender.com/callback/github', passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    const id = 'Ov23liLB16rsl5rkOzda';
    const token = jwt.sign({ id: id }, 'https://oauth2.googleapis.com/token');
    res.cookie("jwt", token);
    res.redirect('/contactos');
  });

router.post('/send', async (req, res) => controller.add(req, res));
router.post('/login', async (req, res) => AuthProtect.login(req, res));
router.get('/login', AuthProtect.protectRouteLogOut, async (req, res) => { res.render('login'); });
router.get('/users', async (req, res) => {});
router.get('/logout', async (req, res) => AuthProtect.logout(req, res));
router.get('/contactos', AuthProtect.protectRoute, async (req, res) => {
  const contactos = await controller.model.getContacts();
  res.render('contactos', {
    get: contactos
  });
});

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express',
    KEYPUBLIC: 'G-1GVLQ7X3ML'
  });
});

module.exports = router;