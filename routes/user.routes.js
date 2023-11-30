const express = require("express");
const { registerUser, loginUser, getAllUsers } = require("../controllers/users.controller");
const route = express();

route.post("/register", registerUser);

route.post("/login", loginUser)

route.get("/", getAllUsers)

module.exports = route;
