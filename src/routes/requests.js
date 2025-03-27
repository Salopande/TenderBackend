const express = require('express')
const requestRouter = express.Router();
const User = require('../models/user');
const {userAuth} = require('../middleware/auth')


requestRouter.post("/sendConnectionRequest", userAuth, async(req,res)=>{
    console.log("sendConnectReq")
    res.send("Connection req Sent!")
})

module.exports = requestRouter