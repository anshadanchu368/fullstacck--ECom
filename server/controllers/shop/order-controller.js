const Order =require("../../models/Order.js");
// const  paypal =require("@paypal/checkout-server-sdk");
const  crypto =require("crypto");

const Razorpay = require('razorpay');

const instance = new Razorpay({
  key_id:'rzp_test_LZqXhohFdSTz37',
  key_secret:'2L5N1SpMN7u5fTNUvphTwr1F'
});
 const createRazorpayOrder = async (req, res) => {
  try {
    const {
      userId,
      cartId,
      cartItems,
      addressInfo,
      totalAmount,
    } = req.body;

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Something went wrong");

    // Temporarily store order in DB with pending status
    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      totalAmount,
      paymentMethod: "razorpay",
      orderStatus: "pending",
      paymentStatus: "pending",
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      order,// from razorpay
      orderId: newOrder._id// from mongodb
    });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


 const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256","2L5N1SpMN7u5fTNUvphTwr1F")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await Order.findByIdAndUpdate(orderId, {
        paymentId: razorpay_payment_id,
        paymentStatus: "paid",
        orderStatus: "confirmed",
        orderUpdateDate: new Date(),
      });

      return res.status(200).json({ success: true, message: "Payment verified" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Payment verification failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



module.exports =  {createRazorpayOrder,verifyRazorpayPayment} ;
