const express = require("express");
const { registerUser, loginUser, getAllUsers, editUser } = require("../controllers/users.controller");
const route = express();

route.post("/register", registerUser);

route.post("/login", loginUser)

route.get("/", getAllUsers)

route.patch("/:id", editUser )

module.exports = route;
