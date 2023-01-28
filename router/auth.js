require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const router = new express.Router();
const bodyParserv = require("body-parser");
const User = require("../models/auth");
const db = require("../config/dbconfig");
const jwt = require("jsonwebtoken");

// register of user
router.post("/users", async (req, res) => {
  try {
    const { name, email, password, mobileNumber } = req.body;

    const userExist = await User.findOne({
      $or: [{ name }, { email }, { mobileNumber }],
    });
    if (userExist) {
      return res.status(406).send({ msg: "User already exists" });
    }
    const strongPasswords =
      /^(?=.*\d)(?=.*[!@#$%^&*-?])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (strongPasswords.test(password)) {
      // bcrypt password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const userCreate = new User({
        name,
        email,
        password: hashPassword,
        mobileNumber,
      });
      const accessToken = jwt.sign(
        { user_create: userCreate._id },
        process.env.TOKEN_SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );
      const saveUser = await userCreate.save();
      res.status(201).send({
        message: "User Saved Sucessfully",
        id: saveUser._id,
        accessToken: `${accessToken}`,
      });
    } else {
      res.status(400).send({
        success: false,
        message:
          "Password should have minimum 8 characters and include atleast one digit,one uppercase letter, one lowercase letter and one special character.",
      });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send({ success: false, message: "Something went wrong" });
  }
});

// login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userCheck = await User.findOne({ email: email });
    if (!userCheck) {
      return res.status(401).send({ msg: "Not Valid admin" });
    }
    const matchPassword = await bcrypt.compare(password, userCheck.password);

    if (!matchPassword) {
      return res.status(401).send({ msg: "Wrong Password" });
    }
    res.status(200).send({
      message: "User logged in successfully",
    });
  } catch (err) {
    res.status(400).send(`err ${err}`);
    console.log(err);
  }
});

// get a user by his/her username
router.get("/users/:username", async (req, res) => {
  try {
    const userName = req.params.username;
    const isUserObj = await User.findOne({ username: userName });

    if (!isUserObj) {
      res.status(400).send({ message: "No user found with this name" });
    } else {
      console.log(isUserObj);
      res.status(200).send(isUserObj);
    }
  } catch (error) {
    res.status(400).send(`err ${err}`);
    console.log(err);
  }
  const userName = req.params.username;
});

// Middleware to authenticate user by verifying his/her jwt-token.
async function auth(req, res, next) {
  let token = req.body.accessToken;

  // token = token.split(" ")[1]; //Access token
  console.log(token);

  jwt.verify(token, process.env.TOKEN_SECRET_KEY, async (err, user) => {
    if (user) {
      req.user = user;
      next();
    } else if (err.message === "jwt expired") {
      return res.json({
        success: false,
        message: "Access token expired",
      });
    } else {
      console.log(err);
      return res.status(403).json({ err, message: "User not authenticated" });
    }
  });
}

module.exports = router;
