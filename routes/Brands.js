const express = require("express");
const { fetchAllBrands } = require("../controller/Brand");

const router = express.Router();

router.get("/", fetchAllBrands);

exports.router = router;
