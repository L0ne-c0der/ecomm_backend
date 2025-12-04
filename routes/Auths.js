const express = require("express");
const {
  createUser,
  refreshAccessToken,
  loginUser,
  logoutUser,
} = require("../controller/Auth");

const router = express.Router();

router
  .post("/signup", createUser)
  .post("/login", loginUser)
  .post("/refresh", refreshAccessToken)
  .post("/logout", logoutUser);

exports.router = router;
