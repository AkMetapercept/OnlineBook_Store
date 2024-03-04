const mongoose=require("mongoose")

const bookSchema=mongoose.Schema({

    title:{
        type:String,

    },
    author:{
        type:String,
        require:true,
    },
    price:{
        type:Number,
        require:true,
    },
    reviews:{
        type:Number,

    }

})
const Book=mongoose.model("Book",bookSchema)

module.exports= Book;