const express = require("express");
const {
  // createUser,
  fetchAllUsers,
  fetchUserById,
  updateUser,
} = require("../controller/User");
const addressRouter = require("./Address"); // ensure routes/Address.js exports router
const cartRouter = require("./Carts"); // ensure routes/Carts.js exports router

const router = express.Router();

router
  // .post("/", createUser)
  .get("/", fetchAllUsers)
  .get("/:id", fetchUserById)
  .patch("/:id", updateUser);

router.use("/:userId/addresses", addressRouter.router); // Mount address routes
router.use("/:userId/carts", cartRouter.router); // Mount cart routes

exports.router = router;
