const { registerAttendanceService, marcarFaltasUsuariosNoAsistentes } = require("../services/attendances.service");

const registerAttendance = async (req, res) => {
  try {
    const newAttendance = await registerAttendanceService(req.body)
    res.status(201).json({ newAttendance });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const attendanceController = async (req, res) => {
  try {
    await marcarFaltasUsuariosNoAsistentes(req.body);
     res.send('Faltas marcadas exitosamente.');
  } catch (error) {
    res.status(500).json(error.message);
  }
}

module.exports = {
  registerAttendance,
  attendanceController
};