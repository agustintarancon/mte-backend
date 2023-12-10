const Attendance = require("../models/attendance.model");
const User = require("../models/user.model");

const registerAttendanceService = async ({ fechaHora, userId, present }) => {
  let mediaFalta = false

  const fechaHoraObject = new Date(fechaHora);
  const diaAsistencia = fechaHoraObject.getDay();
  const horaAsistencia = fechaHoraObject.getHours();
  const minutosAsistencia = fechaHoraObject.getMinutes();
  console.log(horaAsistencia)
  console.log(minutosAsistencia)
  if (diaAsistencia < 1 || diaAsistencia > 5) throw new Error("Asistencia fuera del dia permitido");
  if (horaAsistencia < 5 || horaAsistencia >= 14) throw new Error("Asistencia fuera del horario permitido");

  const newAttendance = await Attendance.create({ fechaHora, userId, present });
  if (!newAttendance) throw new Error("Hubo un error al crear la asistencia");
  
  if (horaAsistencia > 5 || minutosAsistencia > 20) {
    mediaFalta = true
  } 
  console.log(`falta:${mediaFalta}`)

  if (present) {
    present = false
  } else if (!present) {
    present = true
  }
  console.log(`presente:${present}`)

  return ({newAttendance, mediaFalta});
};

const marcarFaltasUsuariosNoAsistentes = async () => {
  try {
    // Obtener la lista de todos los usuarios
    const usuarios = await User.find();
    // Obtener la fecha actual
    const fechaActual = new Date();
    // Recorrer la lista de usuarios
    for (const usuario of usuarios) {
      // Verificar si el usuario tiene asistencia registrada para el día actual
      const asistenciaUsuario = await Attendance.findOne({
        userId: usuario._id,
        fechaHora: {
          $gte: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate(), 0, 0, 0),
          $lt: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + 1, 0, 0, 0),
        },
      });
      // Si no hay asistencia registrada, aplicar falta
      if (!asistenciaUsuario) {
        usuario.faults = (usuario.faults) + 1;
        await usuario.save()
        console.log(`Falta registrada para el usuario ${usuario.userName}`);
      }
    }
    console.log("Proceso de marcado de faltas completado.");
  } catch (error) {
    console.error("Error al marcar faltas:", error.message);
  }
};


module.exports = {
  registerAttendanceService,
  marcarFaltasUsuariosNoAsistentes
};
