const express=require("express");

const router=express.Router();



const { addToCart, updateCartItem, removeFromCart }=require("../controller/ShoppingCartController")




router.post("/addToCart",addToCart)

router.post("/updateCart",updateCartItem)

router.delete("/deleteCart",removeFromCart)

module.exports=router;

