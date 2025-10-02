const express = require("express");
const {
  CreateProduct,
  fetchAllProducts,
  fetchProductById,
  updateProduct,
} = require("../controller/Product");

const router = express.Router();

router
  .post("/", CreateProduct)
  .get("/", fetchAllProducts)
  .get("/:id", fetchProductById)
  .patch("/:id", updateProduct);

exports.router = router;
