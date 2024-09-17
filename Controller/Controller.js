const User= require('../Model/model.js');
const emailvalidator=require('email-validator');
const bcrypt=require('bcrypt');
exports.home=async(req,res)=>{
         res.send('WE ARE STARTING THE SIGNIN AND  SIGNUP PAGE HERE...!')

}
exports.signup=async(req,res)=>{
    const{name,email,contact,password,confirmpassword}=req.body;
    console.log(name,email,contact,password,confirmpassword);
    
    if(!name || !email || !contact|| !password || !confirmpassword){
        return res.status(400).json({
            success:false,
            message:"Every field is mendatory..!"
        })
    }
    if(password !==confirmpassword){
        return res.status(400).json({
            success:false,
            message:"password and confirmPassword don't match..!"
        })
    }
     const validate= emailvalidator.validate(email);
     if(!validate){
        return res.status(400).json({
            success:false,
            message:"please provide valid email address..!"
        })
     }
    try {
        const user= await User.create({
            name,
            email,
            contact,
            password,
            confirmpassword
        });
        return res.status(200).json({
            success:true,
            message:"user sign up successfully....!",
            user
        })
         

    } catch (error) {

        if(error.code===11000){
            return res.status(400).json({
                success:false,
                message:"user already exist with same email adress..!"
            })
        }
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

exports.signin=async(req,res)=>{
    const{email,password}=req.body;
    if(!email|| !password){
        return res.status(400).json({
            success:false,
            message:"Every field is mendatory..!"
        })
    }

    try {
        const user=  await User.findOne({email}).select('+password');
        if(!user || ! (await bcrypt.compare(password,user.password))){
            return res.status(400).json({
                success:false,
                message:"Invalid Credential...!"
            })
        }
        const token=user.jwtToken();
        user.password=undefined;
        const cookieoption={
            maxAge:24*60*60*1000,
            httpOnly:true
        }
        res.cookie('token',token,cookieoption);
        res.status(200).json({
            success:true,
            message:"User Signin Successfully...!",
            user
        })

    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
exports.getUser=async(req,res)=>{
   const getdetails=req.user.id;
    try {
        const getuser= await User.findById(getdetails);
        return res.status(200).json({
            success:true,
            message:"User Details Fetched Successfully..!",
            data:getuser
        })
        
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
exports.logout=async(req,res)=>{
    
    try {
        const cookieoption={
            expires:new Date(),
            httpOnly:true
        }
        res.cookie('token',null,cookieoption);
        return res.status(200).json({
            success:true,
            message:"User successfully logout...!"
        })    
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
exports.forgotpassword=async(req,res)=>{
    const email=req.body.email;
    if(!email){
        return res.status(400).json({
            success:false,
            message:"Email field is mendatory..!"
        })
    }
    
    try {
        const user= await User.findOne({email});
    if(!user){
        return res.status(400).json({
            success:false,
            message:"user doesnot exist..!"
        })
    }
        const forgetPasswordToken=user.getForgetPasswordToken();
        await user.save();
        return res.status(200).json({
            success:true,
            token:forgetPasswordToken
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
exports.resetrPassword=async(req,res)=>{

}