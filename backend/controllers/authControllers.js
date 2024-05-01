const jwt = require("jsonwebtoken");
const User = require("../models/users");
const brcypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    const hashedPassword = await brcypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();

    
    res.status(201).json({ message: "User Created Successfully" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await brcypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        user: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "User logged In",
      success: true,
      userId: user._id,
      username: user.username,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { username } = req.body;
    const token = jwt.sign({ user: User.username }, process.env.JWT_SECRET, {
      expiresIn: 0,
    });
    res.json({ success: true, token, username: req.username });
  } catch (error) {
    next(error);
  }
};

const validate = async (req, res, next) => {
  try {
    res.status(200).json({ message: "Token is vaild", user: req.user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, validate };
