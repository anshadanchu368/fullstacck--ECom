const express = require("express");
const {  createRazorpayOrder, getRazorpayKey, verifyRazorpayPayment, getAllOrderByUSer, getOrderDetails } = require("../../controllers/shop/order-controller");


const router = express.Router();

// Route to create PayPal order
router.post("/create", createRazorpayOrder);
router.post("/verify", verifyRazorpayPayment);
router.get("/getkey", getRazorpayKey);

  router.get("/list/:userId",getAllOrderByUSer)
  router.get("/details/:id",getOrderDetails)


module.exports =router
  