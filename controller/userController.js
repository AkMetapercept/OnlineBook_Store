const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

const dotEnv=require("dotenv")


// Register Controller

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
  
 
    if (!emailRegex.test(email)) {
      res.status(400).json({message:"Invalid email format"})
    
    }
  
    if (!passwordRegex.test(password)) {
      res.status(400).json({message:"Invalid password format. Password must contain at least 6 characters including one special symbol."})
  
    }
  
    const userExists = await User.findOne({ email });
  
    if (userExists) {
      res.status(400).json({message:"User already exists"})
    
    }
  
    const user = await User.create({
      name,
      email,
      password,
    });
  
    if (user) {
      generateToken(res, user._id);
  
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400).json({message:"Invalid user data"})
    }
  });
  

//Login Controller
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
  
    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
  
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  });




//Logout Controller

const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};



// Update Password controller
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
  
    if (!user) {
        return res.status(404).json({message: "User not found"});
    }
  
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({message: "Unauthorized: No token provided"});
    }
  
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
  
        if (decoded.userId !== user._id.toString()) {
            return res.status(401).json({message: "Unauthorized: Token does not match user"});
        }

        if (decoded.exp < Date.now() / 1000) {
            return res.status(401).json({message: "Unauthorized: Token expired"});
        }
    } catch (err) {
        return res.status(401).json({message: "Unauthorized: Invalid token"});
    }
  
    if (req.body.oldPassword) {
        const isPasswordMatch = await user.matchPassword(req.body.oldPassword);
        if (!isPasswordMatch) {
            return res.status(401).json({message: "Unauthorized: Old password is incorrect"});
        } else {
            
            if (req.body.password) {
                user.password = req.body.password;
            }
        }
    } else {
       
        return res.status(400).json({message: "Old password is required"});
    }
    if (req.body.oldPassword === req.body.password) {
        return res.status(400).json({message: "New password is the same as the old password. Please choose a different password."});
    }
  
    user.email = req.body.email || user.email;
  
    const updatedUser = await user.save();
  
    res.json({
        _id: updatedUser._id,
        email: updatedUser.email,
    });
});
  



const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, "" + process.env.JWT_KEY, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,

    sameSite: "strict", 
    maxAge: 30 * 60 * 60 * 1000, 
  });
}

module.exports = {
    loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
 
};