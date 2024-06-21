require('dotenv').config();
const express = require('express');
const router = express.Router();
const ContactosController = require('./ContactosController');
const AuthProtect = require('./Auth');
const controller = new ContactosController();
const passport = require('passport');
const jwt = require('jsonwebtoken')




AuthProtect.Passport();
router.get('/github', passport.authenticate('github'));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    const id = process.env.ID;
    const token = jwt.sign({ id: id }, process.env.JWTSECRET);
    res.cookie("jwt", token);
    res.redirect('/contactos')
  });
router.post('/send', async (req, res) => controller.add(req, res));
router.post('/login', async (req, res) => AuthProtect.login(req, res));
router.get('/login', AuthProtect.protectRouteLogOut, async (req, res) => { res.render('login') });
router.get('/logout', async (req, res) => AuthProtect.logout(req, res))
router.get('/contactos', AuthProtect.protectRoute, async (req, res) => {
  const contactos = await controller.model.getContacts();
  res.render('contactos', {
    get: contactos
  })
})
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express',
    KEYPUBLIC: process.env.KEY_PUBLIC
  });
});





module.exports = router;
