const express = require("express");
const { getAllOrderofAllUsers,
  getOrderDetailsOfAdmins,
  updateOrderStatus,
  deleteOrder,
  deleteAllOrders} =require("../../controllers/admin/order-controller")


const router = express.Router();


  router.get("/get",getAllOrderofAllUsers)
  router.get("/details/:id",getOrderDetailsOfAdmins)
  router.put("/update/:id",updateOrderStatus)
  router.delete("/delete/:id", deleteOrder);
router.delete("/delete-all", deleteAllOrders);


module.exports =router
  