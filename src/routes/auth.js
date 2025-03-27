const express = require('express')

const authRouter = express.Router()
const User = require('../models/user');
const {validationSignUp} = require('../utlis/validation')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {userAuth} = require('../middleware/auth')
authRouter.use(express.json())
authRouter.post('/signup',async(req,res)=>{
    
    console.log(req.body)

    const {firstName, lastName, emailId, password} = new User(req.body)
    //const user = new User(userObj)
    try{
    validationSignUp(req)
    const {password} = req.body;
    const passwordHash = await bcrypt.hash(password,10)
    console.log(passwordHash)
    const user = new User({firstName, lastName, emailId, password:passwordHash})
    await user.save()
      res.send("Data sucessfully saved")
    }catch(err){
      res.status(400).send("Error Saving the user:" +err.message);
    }
   
})

authRouter.post('/login', async(req,res)=>{
    try{
    const {emailId, password} = req.body;
    const user = await User.findOne({emailId:emailId})
    if(!user){
        throw new Error("EmailId is not preset in th ID")
    }
    const isPassValid = await bcrypt.compare(password,user.password)
    if(isPassValid){
        const token= await user.getJWT();
        console.log(token)
        res.cookie('token',token)
         res.send("Login Sucessfully")
    }else{
        throw new Error("password is not valid")
    }
    }
    catch(e){
     res.status(404).send("Error:" + e.message)
    }
})


module.exports = authRouter