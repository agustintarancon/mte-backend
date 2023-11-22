// Importa los módulos necesarios
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { connection } = require("../db/connection");
const userRoutes = require("../routes/user.routes");
const cors = require('cors');


// Variables de entorno
dotenv.config();
const port = process.env.PORT;

// Instancia de express
const app = express();
// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Escuchando puerto
app.listen(port, () => {
  console.log(`Estamos escuchando el puerto ${port}`);
});

// Definiendo rutas
app.use("/users", userRoutes);

// Inicia la conexión a la base de datos
connection();
