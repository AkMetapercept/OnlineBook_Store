const asyncHandler=require("express-async-handler");

const Order = require("../model/orderModel");
const Book = require("../model/bookModel");



// Controller for creating a new order


 const createOrder =asyncHandler( async (req, res) => {
    try {
      const { userId, items } = req.body;
       
      for (const item of items) {
        const book = await Book.findById(item.bookId);
        if (!book || book.quantity < item.quantity) {
          return res.status(400).json({ message: `Book with ID ${item.bookId} is out of stock.` });
        }
      }
  
      let totalAmount = 0;
      for (const item of items) {
        const book = await Book.findById(item.bookId);
        totalAmount += book.price * item.quantity;
      }
  
      const order = new Order({
        userId,
        items,
        totalAmount,
        status: 'Pending'
      });
  
    
      await order.save();
  
      res.status(201).json({ message: 'Order placed successfully.', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  })


// Controller for fetching all orders
const getAllOrders =asyncHandler(async (req, res) => {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  })

// Controller for fetching orders by user ID
const getOrdersByUserId =asyncHandler(async (req, res) => {
    try {
      const userId = req.params.userId;
      const orders = await Order.find({ userId });
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  })



//Update the status of order
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;
   
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json({ message: 'Order status updated successfully.', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};



module.exports={
    createOrder,
    getAllOrders,
    getOrdersByUserId,
    updateOrderStatus

}