const express = require("express");
const {
  createCart,
  fetchUserCarts,
  updateCart,
  deleteCart,
  clearCartByUserId,
} = require("../controller/Cart");

const router = express.Router({ mergeParams: true });

router.post("/", createCart);
router.get("/", fetchUserCarts);
router.patch("/:id", updateCart);
router.delete("/:id", deleteCart);
router.delete("/clear", clearCartByUserId);

exports.router = router;
