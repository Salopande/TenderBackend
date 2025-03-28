const express = require('express')
const profileRouter = express.Router();
const User = require('../models/user');
const {userAuth} = require('../middleware/auth')
const {validateProfileEditData} = require('../utlis/validation')
const cookieParser = require('cookie-parser')
profileRouter.use(cookieParser())

profileRouter.get("/profile/view",userAuth, async(req,res)=>{
    try{
    const user = req.user;
    console.log(user)
    res.send(user)
    }
    catch(err){
        res.status(400).send("Error:"+err.message)
    }
})

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
     try{
        if(!validateProfileEditData(req)){
            throw new Error("Invalid Edit Request")
        }
        const loginuser = req.user;
        console.log(loginuser)
        Object.keys(req.body).forEach((key)=>loginuser[key]=req.body[key])
        await loginuser.save()
        res.send(`${loginuser.firstName} your profile edit sucssfully`)
     }catch(err){
        res.status(400).send("Error:"+err.message)
     }
})

module.exports = profileRouter
