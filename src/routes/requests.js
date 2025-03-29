const express = require('express')
const requestRouter = express.Router();
const User = require('../models/user');
const {userAuth} = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const cookieParser = require('cookie-parser')
requestRouter.use(cookieParser())

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req,res)=>{
    try{
         const fromUserId = req.user._id;
         const toUserId = req.params.toUserId;
         const status = req.params.status;
         const allowstatus =['ignore','interested'];
         if(!allowstatus.includes(status)){
          return res.status(400).json({message:"Invalid status type"})
         }
         const toUser = await User.findById(toUserId)
         if(!toUser){
            return res.status(400).json({message:"User Not Found"})
         }
         const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
         });
         const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ]
        })
         if(existingConnectionRequest){
            return res.status(400).json({message:"Not Allowes"})
         }
         const data = await connectionRequest.save();
         res.json({
           message:"Connection Request sent Successfully",
           data,
         })
    }
    catch(err){
      res.status(400).send("Error:" +err.message)
    }
})

module.exports = requestRouter