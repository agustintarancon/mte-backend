const { registerUserService, loginUserService, getAllUsersService } = require("../services/user.service");

const registerUser = async (req, res) => {
  try {
    const newUser = await registerUserService(req.body);
    res.status(201).json({ newUser });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const loguedUser = await loginUserService(req.body);
    res.status(201).json({ loguedUser });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const info = await getAllUsersService(req.query)
    res.status(201).json({ info })
  } catch (error) {
    res.status(500).json(error.message);
  }
}

module.exports = {
  registerUser,
  loginUser,
  getAllUsers
};
