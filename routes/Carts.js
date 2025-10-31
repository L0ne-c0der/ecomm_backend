const express = require("express");
const {
  createCart,
  fetchUserCarts,
  updateCart,
  deleteCart,
  clearCartById,
} = require("../controller/Cart");

const router = express.Router();

router.post("/", createCart);
router.get("/:userId", fetchUserCarts);
router.patch("/:cartId", updateCart);
router.delete("/:cartId", deleteCart);
router.delete("/clear/:userId", clearCartById);

exports.router = router;
