const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const registerUserService = async ({userName,document,password,category,}) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = await User.create({
    userName,
    document,
    password: hashedPassword,
    category,
  });

  if (!newUser) throw new Error("Hubo un error al crear el nuevo usuario");

  return newUser;
};

const loginUserService = async ({ document, password }) => {
  let userFounded;

  if (document) {
    userFounded = await User.findOne({ document });
  }
  if (!userFounded) throw new Error("Los datos ingresados no son válidos");

  const passwordMatch = await bcrypt.compare(password, userFounded.password);

  if (!passwordMatch) throw new Error("Los datos ingresados no son válidos");

  return userFounded ;
};

const getAllUsersService = async ({ userName }) => {
  let query = {};
  if (userName) {
    query.userName = { $regex: new RegExp(userName, 'i') };
  }
  
  try {
    const allUsers = await User.find(query)
    .populate({
      path: 'attendances',
      select: 'fechaHora userId present'
    })

    if (allUsers.length === 0) {
      throw new Error("No se encontraron usuarios con los filtros seleccionados");
    }
    console.log(allUsers)
    return allUsers;
  } catch (error) {
    throw new Error("Error al obtener usuarios: " + error.message);
  }
}

const editUserService = async (userId, updatedData) => {
  if (updatedData.document) {
    const {document} = updatedData
    const documentExist = await User.findOne({ document })
    if (documentExist) throw new Error("El documento ingresado ya está en uso.");
  }

  if (updatedData.password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(updatedData.password, saltRounds);
    updatedData.password = hashedPassword;
  }
  
  const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
  return updatedUser;
}

module.exports = {
  registerUserService,
  loginUserService,
  getAllUsersService,
  editUserService
};
