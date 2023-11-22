const express = require("express");
const { registerUser, loginUser } = require("../controllers/users.controller");
const route = express();

route.post("/register", registerUser);

route.post("/login", loginUser)

module.exports = route;
