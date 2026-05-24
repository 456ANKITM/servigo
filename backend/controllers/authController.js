import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
  try {
    let { name, email, password, role, services} = req.body;

     // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }

    const allowedRoles = ["client", "worker"];
    if (!role || !allowedRoles.includes(role)) {
      role = "client";
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

        let formattedServices = [];

    if (services) {
      formattedServices = Array.isArray(services)
        ? services
        : [services];

      formattedServices = formattedServices.filter(Boolean);
    }

     if (role === "worker") {
      if (!formattedServices || formattedServices.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one service is required for workers",
        });
      }
    }
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      services: formattedServices
    });
    await user.save();
    res.status(201).json({ success: true, message: "User created Successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    res.json({success:false, message:"Server Error", error})
  }
};

export const login = async (req, res) => {
   try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
      return res.json({success:false, message:"User not found"})
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.json({success:false, message:"Wrong Password"})
    }
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:"7d"} )
    const userData = user.toObject();
    delete userData.password;

   res.cookie("token", token, {
    httpOnly: true,
     secure: true,
     sameSite: "None",
     maxAge:  24*60*60*1000,
});

    res.json({success:true, message:"Login Successfull", user:userData})
    
   } catch (error) {
    console.error("Error:", error.message)
    res.json({Success:false, message:"Server Error"})
   }
};


export const logout = async (req, res) => {
  try {
    res.cookie("token", "",{
      httpOnly:true,
      secure:true,
      sameSite:"strict",
      expires:new Date(0),
    })
    return res.status(200).json({ success:true, message:"Logged out successfully"})
  } catch (error) {
    return res.status(500).json({ success:false, message:'Server Error', error})
  }
}