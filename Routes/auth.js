const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//Register
router.post("/signup", async (req, res) => {
  try {
    //Encrypt Password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    //Create New User
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    //Save User and Response
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    //Checking User
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).send("User not found");
    //Comparing Password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("Wrong Password");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
