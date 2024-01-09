const Attendance = require("../models/attendance.model");
const User = require("../models/user.model");

const registerAttendanceService = async ({ fechaHora, userId, present }) => {
  const fechaHoraObject = new Date(fechaHora);
  const diaAsistencia = fechaHoraObject.getDay();
  const horaAsistencia = fechaHoraObject.getHours();
  const minutosAsistencia = fechaHoraObject.getMinutes();
  console.log(horaAsistencia)
  // console.log(minutosAsistencia)
  // if (diaAsistencia < 1 || diaAsistencia > 5) throw new Error("Asistencia fuera del dia permitido");
  if (horaAsistencia < 7 || horaAsistencia >= 17) throw new Error("Asistencia fuera del horario permitido");

  const newAttendance = await Attendance.create({ fechaHora, userId, present });
  if (!newAttendance) throw new Error("Hubo un error al crear la asistencia");
  
  if (horaAsistencia > 8 || minutosAsistencia > 20) {
    const userFounded = await User.findById(userId);
    userFounded.halfFaults = (userFounded.halfFaults) + 1;
    userFounded.save();
  } 

  if (present) {
    present = false
  } else if (!present) {
    present = true
  }
  console.log(`presente:${present}`)

  return ({newAttendance});
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


const getDifferenceInHours = (startDate, endDate) => {
  const diffInMilliseconds = endDate - startDate;
  return diffInMilliseconds / (1000 * 60 * 60);
};

const getDailyAttendances = async () => {
  try {
    // Obtener la fecha actual
    const fechaActual = new Date();
    // Inicializar un array para almacenar las asistencias del día
    const dailyAttendances = [];

    // Obtener la lista de todos los usuarios
    const usuarios = await User.find();

    // Recorrer la lista de usuarios
    for (const usuario of usuarios) {
      // Obtener las asistencias del usuario para el día actual
      const asistenciasUsuario = await Attendance.find({
        userId: usuario._id,
        fechaHora: {
          $gte: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate(), 0, 0, 0),
          $lt: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + 1, 0, 0, 0),
        },
      });

      // Verificar si hay más de una asistencia para calcular la diferencia
      if (asistenciasUsuario.length > 1) {
        // Ordenar las asistencias por fechaHora (ascendente)
        asistenciasUsuario.sort((a, b) => a.fechaHora - b.fechaHora);

        // Calcular la diferencia de horas entre las asistencias
        const primeraAsistencia = asistenciasUsuario[0].fechaHora;
        const ultimaAsistencia = asistenciasUsuario[asistenciasUsuario.length - 1].fechaHora;
        const diferenciaEnHoras = getDifferenceInHours(primeraAsistencia, ultimaAsistencia);

        const total = Math.floor(diferenciaEnHoras) * 100

        usuario.salary = (usuario.salary) + total;
        usuario.save();

        console.log(`Diferencia de horas para ${usuario.nombre}: ${diferenciaEnHoras} horas`);
      } else {
        console.log(`No hay suficientes asistencias para ${usuario.nombre} en el día actual`);
      }
    }
  } catch (error) {
    console.error("Error al obtener asistencias del día actual:", error.message);
    throw error;
  }
};

module.exports = {
  registerAttendanceService,
  marcarFaltasUsuariosNoAsistentes,
  getDailyAttendances
};
