const Order = require("../../models/Order");




const getAllOrderofAllUsers = async(req,res)=>{
    try{
  
       const orders = await Order.find({})
  
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

  const getOrderDetailsOfAdmins = async(req,res)=>{
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


  const updateOrderStatus = async(req,res)=>{
    try{
        const {id}=req.params;
        const {orderStatus} =req.body

        const order = await Order.findById(id)
        
        if(!order){
          return res.status(404).json({
            success:false,
            message:'order not found'
          })
        }

        await Order.findByIdAndUpdate(id,{orderStatus})

        res.status(200).json({
          success:true,
          message:'Order Status Updated'
        })

    }catch(e){
      res.status(500).json({ message: "Server error", error: e.message });
    }
  }
  

  module.exports ={getAllOrderofAllUsers, getOrderDetailsOfAdmins, updateOrderStatus}