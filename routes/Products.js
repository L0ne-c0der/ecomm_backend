const express = require("express");
const { CreateProduct } = require("../controller/Product");

const router = express.Router();

router.post("/products", CreateProduct);

exports.router = router;
