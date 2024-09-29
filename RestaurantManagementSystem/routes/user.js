require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// User registration
router.post('/register', async (req, res)=> {
  const { name, email, password, role} = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({staus:"success",data:{message:"User already exists"}});

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword ,role});
  
  await user.save();
  res.json({staus:"success",data:{message:"user registered successfully"}});
});

// User login
router.post('/login', async (req, res) => {
  try{
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({staus:"success",data:{message:"Invalid credentials"}});

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({staus:"success",data:{message:"wrong password"}});

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      status:"success",
      data: {
        message: "Logged in successfully",
        token,
      }
    });
  }
  catch(error){
    return res.json({
      status:"error",
      data: {
        message: "Invalid credentials",
        error
      }
    })
  }
});

module.exports = router;