const asyncHandler=require("express-async-handler");

const Cart=require("../model/shoppingCartModel")

const Bookk=require("../model/bookModel")


// Adding To Cart
const addToCart=asyncHandler(async(req, res,next)=> {
    const { userId, bookId, quantity } = req.body;
  
    try {
     
      const book = await Bookk.findById(bookId);
      if (!book) {
         res.status(404).json({ error: 'Book not found' });
      }
  
      let cart = await Cart.findOne({ user: userId });
      
      if (!cart) {
        cart = new Cart({ user: userId, items: [] });
      }
        
      const existingItem = cart.items.find(item => item.book.toString() === bookId);
      if (existingItem) {
      
        existingItem.quantity += quantity;
      } else {
        
        cart.items.push({ book: bookId, quantity });
      }
       
      await cart.save();
  
      res.status(201).json(cart);

    } catch (error) {

      res.status(500).json({ error: 'Internal Server Error' });
    }
  })


// Updating The Cart

const  updateCartItem=asyncHandler(async(req, res)=>{
  
  const { userId, itemId, quantity } = req.body;

  try {
   
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.find(item => item._id.toString() === itemId);

    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    item.quantity = quantity;

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})


//Removing From The Cart


 const removeFromCart=asyncHandler( async(req, res)=> {
  const { userId, bookId } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const updateItems = cart.items.filter(item => item.book.toString() !== bookId);

    if (updateItems.length === cart.items.length) {
      return res.status(404).json({ error: 'Book not found in cart' });
    }

    cart.items = updateItems;

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
)


module.exports={
    addToCart,
    updateCartItem,
  removeFromCart,

}