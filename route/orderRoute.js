const express=require("express");

const router=express.Router();


const { createOrder, getAllOrders, getOrdersByUserId, updateOrderStatus }=require("../controller/orderController");


router.get("/getAllOrder",getAllOrders);
router.post("/createOrder",createOrder)
router.get("/getOrderById/:userId",getOrdersByUserId)
router.put("/updateOrderStatus/:orderId",updateOrderStatus)

module.exports=router;