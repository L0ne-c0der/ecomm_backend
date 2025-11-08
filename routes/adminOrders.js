const express = require("express");
const { fetchAllOrders, updateOrder } = require("../controller/Order");

const router = express.Router();

router.get("/", fetchAllOrders).patch("/:id", updateOrder);

exports.router = router;
