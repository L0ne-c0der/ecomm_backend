const express = require("express");
const {
  fetchAllCategories,
  CreateCategory,
} = require("../controller/Category");

const router = express.Router();

router.get("/", fetchAllCategories).post("/", CreateCategory);

exports.router = router;
