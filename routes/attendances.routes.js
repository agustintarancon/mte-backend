const express = require("express");
const { registerAttendance, attendanceController } = require("../controllers/attendances.controller");
const route = express();

route.post("/register", registerAttendance);
route.post("/", attendanceController);

module.exports = route;
