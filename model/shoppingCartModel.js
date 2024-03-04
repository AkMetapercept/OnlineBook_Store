const mongoose=require("mongoose");

const cartItemSchema= new mongoose.Schema({

    book:{
        type: mongoose.Schema.Types.ObjectId, ref:"Books",
        require:true,
    },
    quantity:{
        type:Number,
        require:true,
    },

})


const cartSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [cartItemSchema]
  });



const Cart=mongoose.model("Cart",cartSchema);

module.exports= Cart;