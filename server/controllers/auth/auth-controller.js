const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const RegisterUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      hashPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successfull",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error occured",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "login failed",
    });
  }
};



module.exports ={RegisterUser}