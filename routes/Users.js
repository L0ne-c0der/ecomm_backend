const express = require("express");
const {
  // createUser,
  fetchAllUsers,
  fetchUserById,
  updateUser,
} = require("../controller/User");
const addressRouter = require("./Address"); // ensure routes/Address.js exports router
const cartRouter = require("./Carts"); // ensure routes/Carts.js exports router
const orderRouter = require("./userOrders"); // ensure routes/Orders.js exports router
const router = express.Router();
const { ensureOwnerOrAdmin } = require("../middleware/authWares");
const { verifyToken } = require("../middleware/authJwt");

router.use(verifyToken); // Protect all user routes

router
  .get("/", fetchAllUsers)
  .get("/:id", fetchUserById)
  .patch("/:id", updateUser);

router.use("/:userId/addresses", addressRouter.router); // Mount address routes
router.use("/:userId/carts", cartRouter.router); // Mount cart routes
router.use("/:userId/orders", orderRouter.router); // Mount order routes

exports.router = router;
