const express = require("express");
const { fetchAllBrands, CreateBrand } = require("../controller/Brand");

const router = express.Router();

router.get("/", fetchAllBrands).post("/", CreateBrand);

exports.router = router;
