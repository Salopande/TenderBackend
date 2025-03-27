const express = require('express')
const profileRouter = express.Router();
const User = require('../models/user');
const {userAuth} = require('../middleware/auth')

profileRouter.get("/profile",userAuth, async(req,res)=>{
    try{
    const user = req.user;
    console.log(user)
    res.send(user)
    }
    catch(err){
        res.status(400).send("Error:"+err.message)
    }
})

module.exports = profileRouter
