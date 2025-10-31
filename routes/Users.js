const express = require("express");
const {
  // createUser,
  fetchAllUsers,
  fetchUserById,
  updateUser,
} = require("../controller/User");
const addressRouter = require("./Address"); // ensure routes/Address.js exports router

const router = express.Router();

router
  // .post("/", createUser)
  .get("/", fetchAllUsers)
  .get("/:id", fetchUserById)
  .patch("/:id", updateUser);

router.use("/:userId/addresses", addressRouter.router); // Mount address routes

exports.router = router;
