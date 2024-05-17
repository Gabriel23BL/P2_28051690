const ContactosController = require("./ContactosController");
const contactosController = new ContactosController();

const indexController = require("./indexController")

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", indexController);

router.post("/form-contacto", contactosController.add);

module.exports = router;