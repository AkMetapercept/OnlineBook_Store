const asyncHandler=require("express-async-handler");


const Book=require("../model/bookModel")


//Get All Books

const getBooks=asyncHandler(async(req,res,next)=>{

    try {
        const getBook=await Book.find();
    res.status(200).json(getBook);
 
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Error...."})
        
    }
})


//Post Book

const postBook=asyncHandler(async(req,res,next)=>{

    const {title,author,price,reviews}=req.body;
    try {
        
        const books=await Book.create({title,author,price,reviews});
        res.status(200).json(books);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Book Not Created..."})
        
    }

})


// Search By Title

const searchByTitle=asyncHandler(async(req,res,next)=>{

    try {
        const title = req.params.title;
        const books = await Book.find({ title: { $regex: title, $options: 'i' } });
        res.json(books);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }

})


// Search By Author

const searchByAuthor=asyncHandler(async(req,res,next)=>{
    
    try {
        const author=req.params.author;

        const books=await Book.find({author:{$regex:author,$options:'i'} } );
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
})





module.exports={
    getBooks,
    postBook,
    searchByTitle,
    searchByAuthor,
    
}
