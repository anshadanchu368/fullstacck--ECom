const express = require("express");
const { getAllOrderofAllUsers, getOrderDetailsOfAdmins, updateOrderStatus} = require("../../controllers/admin/order-controller");


const router = express.Router();


  router.get("/get",getAllOrderofAllUsers)
  router.get("/details/:id",getOrderDetailsOfAdmins)
  router.put("/update/:id",updateOrderStatus)


module.exports =router
  