const express = require("express");
const { registerAttendance, attendanceController, dia } = require("../controllers/attendances.controller");
const route = express();

route.post("/register", registerAttendance);
route.post("/", attendanceController);
route.post("/dia", dia);

module.exports = route;
