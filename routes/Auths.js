const express = require("express");
const { createUser, loginUser, logoutUser } = require("../controller/Auth");
const passport = require("passport");

const router = express.Router();

router
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), loginUser)
  .post("/logout", logoutUser);

exports.router = router;
