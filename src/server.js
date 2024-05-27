const express = require('express');
const path = require("path");
const rutas = require("./routes/rutas.js")

const app = express()
const port = 3000

// Importar la conexión a la base de datos
const db = require('./db/database.js');
app.use(express.static(path.join(__dirname, "public"))); 
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());



app.use(rutas);
app.listen(port, () => console.log(`Ejecutandose en:  ${port}!`))