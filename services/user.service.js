const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const registerUserService = async ({
  userName,
  document,
  password,
  category,
}) => {
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
  const secretKey = process.env.SECRET_KEY;

  if (document) {
    userFounded = await User.findOne({ document });
  }
  if (!userFounded) throw new Error("Los datos ingresados no son válidos");

  const passwordMatch = await bcrypt.compare(password, userFounded.password);

  if (!passwordMatch) throw new Error("Los datos ingresados no son válidos");

  const payload = {
    userFounded,
  };
  const token = await jwt.sign(payload, secretKey, {
    expiresIn: "10h",
  });

  return { token, userFounded };
};

const getAllUsersService = async({userName}) => {

  let query = {};
  if (userName) {
    query.userName = { $regex: new RegExp(userName, 'i') };
  }

  const allUsers = User.find(query)

  if (allUsers.length === 0) {
    throw new Error("No se encontraron usuarios con los filtros seleccionados");
  }

  return allUsers;
}

const editUserService = async (userId, updatedData) => {
  if (updatedData.email) {
    const {email} = updatedData
    const emailExist = await User.findOne({ email })
    if (emailExist) throw new Error("El correo electrónico ingresado ya está en uso, por favor ingrese otro.");
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
