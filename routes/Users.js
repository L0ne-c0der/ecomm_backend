const express = require("express");
const {
  // createUser,
  fetchAllUsers,
  fetchUserById,
  updateUser,
} = require("../controller/User");

const router = express.Router();

router
  // .post("/", createUser)
  .get("/", fetchAllUsers)
  .get("/:id", fetchUserById)
  .patch("/:id", updateUser);

exports.router = router;
