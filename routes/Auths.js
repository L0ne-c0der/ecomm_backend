const express = require("express");
const { createUser, loginUser, logoutUser } = require("../controller/Auth");

const router = express.Router();

router
  .post("/signup", createUser)
  .post("/login", loginUser)
  .post("/logout", logoutUser);

exports.router = router;
