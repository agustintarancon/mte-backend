const { registerUserService, loginUserService, getAllUsersService, editUserService } = require("../services/user.service");

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

const editUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;
    const modifiedUser = await editUserService(userId, updatedData)
    res.status(201).json({ modifiedUser });
  } catch (error) {
    res.status(400).json(error.message);
  }
}

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  editUser
};
