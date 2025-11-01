const express = require("express");
const {
  createAddress,
  fetchAllAddresses,
  fetchAddressById,
  updateAddress,
  deleteAddress,
} = require("../controller/Address");

const router = express.Router({ mergeParams: true });

router
  .post("/", createAddress)
  .get("/", fetchAllAddresses)
  .get("/:id", fetchAddressById)
  .patch("/:id", updateAddress)
  .delete("/:id", deleteAddress);

exports.router = router;
