const { User } = require("../models/User");
const bcrypt = require("bcryptjs");
const { createError } = require("../error");
const jwt = require("jsonwebtoken");
const cloudinaryConfig = require("../cloudinaryConfig");

const register = async (req, res) => {
  try {
    //check for already exist
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(409).send({ message: "User email already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    console.log(hashedPassword);
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
    console.log(newUser);
    await newUser.save();
    res.status(200).json("User has been successfully created !!!");
  } catch (error) {
    console.log(error.message);
    res.status(409).send(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expiration (optional)
    );

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({
        user: {
          _id: user._id,
          email: user.email,
          token: token,
        },
      });

    console.log("user logged in successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted successfully !!!");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = { register, login, deleteUser };
