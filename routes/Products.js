const express = require("express");
const { CreateProduct, fetchAllProducts } = require("../controller/Product");

const router = express.Router();

router.post("/", CreateProduct).get("/", fetchAllProducts);

exports.router = router;
