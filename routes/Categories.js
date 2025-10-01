const express = require("express");
const { fetchAllCategories } = require("../controller/Category");

const router = express.Router();

router.get("/", fetchAllCategories);

exports.router = router;
