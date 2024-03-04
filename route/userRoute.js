const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  updateUserProfile,
 
} = require("../controller/userController");



const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.put("/profile", protect, updateUserProfile);




module.exports = router;