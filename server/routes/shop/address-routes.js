const express = require("express");



const {
  fetchAlladdress,
  addAddress,
  deleteaddress,
  editaddress,
} = require("../../controllers/shop/address-controllers");

const router = express.Router();

router.post("/add", addAddress);
router.get("/get/:userId", fetchAlladdress);
router.delete("/delete/:userId/:addressId", deleteaddress);
router.put("/update/:userId/:addressId", editaddress);

module.exports=router