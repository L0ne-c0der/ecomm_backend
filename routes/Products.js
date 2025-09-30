const express = require("express");
const { createProduct } = require("../controller/Product");

const router = express.Router();

router.post("/products", createProduct);

exports.router = router;
