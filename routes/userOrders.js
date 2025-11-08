const express = require("express");
const {
  createOrder,
  fetchUserOrders,
  updateOrder,
  deleteOrder,
} = require("../controller/Order");

const router = express.Router({ mergeParams: true });

router.post("/", createOrder);
router.get("/", fetchUserOrders);
router.delete("/:id", deleteOrder);

exports.router = router;
