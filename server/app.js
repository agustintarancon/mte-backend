const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { connection } = require("../db/connection");
const userRoutes = require("../routes/user.routes");
const cors = require("cors");
const attendancesRoutes = require("../routes/attendances.routes");

dotenv.config();
const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.listen(port, () => {
  console.log(`Estamos escuchando el puerto ${port}`);
});

app.use("/users", userRoutes);
app.use("/attendances", attendancesRoutes);

connection();
