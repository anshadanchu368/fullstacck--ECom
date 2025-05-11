const Order =require("../../models/Order.js");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product")
const  crypto =require("crypto");

const Razorpay = require('razorpay');

const instance = new Razorpay({
  key_id:'rzp_test_VfBVWTXibU0PTp',
  key_secret:'k3wh3B0BxXoWlRGtd7FGTXY8'
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
      .createHmac("sha256", "k3wh3B0BxXoWlRGtd7FGTXY8")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // First, get the order to access cart items
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      
      // Update stock for each product
      for(let item of order.cartItems) {
        let product = await Product.findById(item.productId);

        if(!product || product.totalStock < item.quantity) {
          return res.status(404).json({
            success: false,
            message: 'Not enough stock for this product'
            
          });
        }

        product.totalStock -= item.quantity;
        await product.save();
      }
      
      // Update order status
      const updatedOrder = await Order.findByIdAndUpdate(orderId, {
        paymentId: razorpay_payment_id,
        paymentStatus: "paid",
        orderStatus: "confirmed",
        orderUpdateDate: new Date(),
      });

      // Delete the cart
      if (updatedOrder && updatedOrder.cartId) {
        await Cart.findByIdAndDelete(updatedOrder.cartId);
        console.log("🛒 Cart deleted from DB after payment success");
      }

      return res.status(200).json({ success: true, message: "Payment verified" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Payment verification failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const getAllOrderByUSer = async(req,res)=>{
  try{
     const {userId}= req.params;

     const orders = await Order.find({userId})

     if(!orders.length){
      return res.status(404).json({
        success:false,
        message:'no orders found'
      })
     }

     res.status(200).json({
       success:true,
       data:orders
     })

  }catch(e){
    console.error("Payment verification failed:", e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
}


const getOrderDetails = async(req,res)=>{
  try{
    const {id}= req.params;

    const order= await Order.findById(id)

    if(!order){
      return res.status(404).json({
        success:false,
        message:'no order found'
      })
     }

     res.status(200).json({
      success:true,
      data:order
    })
  }catch(e){
    console.error("Payment verification failed:", e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
}

const getRazorpayKey = (req, res) => {
  try {
    const keyData = {
      key: "rzp_test_VfBVWTXibU0PTp",
    };
    res.status(200).json(keyData);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


module.exports =  {createRazorpayOrder,verifyRazorpayPayment,getAllOrderByUSer,getOrderDetails, getRazorpayKey} ;
