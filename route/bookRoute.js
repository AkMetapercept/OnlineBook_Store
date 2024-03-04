const express=require("express");

const router=express.Router();


const { getBooks, postBook, searchByTitle, searchByAuthor }=require("../controller/bookController");


router.get("/getAllBooks",getBooks);
router.post("/postBook",postBook)
router.get("/getByTitle/:title",searchByTitle)
router.get("/getByAuthor/:author",searchByAuthor)

module.exports=router;