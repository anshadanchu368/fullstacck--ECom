const express = require("express");
const { createNewOrder, getKey, createRazorpayOrder, getRazorpayKey, verifyRazorpayPayment, getAllOrderByUSer, getOrderDetails } = require("../../controllers/shop/order-controller");


const router = express.Router();

// Route to create PayPal order
router.post("/create", createRazorpayOrder);
router.post("/verify", verifyRazorpayPayment);
router.get("/getkey", async (req, res) => {
    // Implement the logic to fetch and return necessary data
    try {
      const keyData = {
        // Example response data
        key: "rzp_test_LZqXhohFdSTz37"
      };
      res.status(200).json(keyData);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });

  router.get("/list/:userId",getAllOrderByUSer)
  router.get("/details/:id",getOrderDetails)


module.exports =router
  