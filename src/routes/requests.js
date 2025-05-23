const express = require('express')
const requestRouter = express.Router();
const User = require('../models/user');
const {userAuth} = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const cookieParser = require('cookie-parser')
requestRouter.use(express.json())
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

requestRouter.post(
    "/request/review/:status/:requestId",
    userAuth,
    async (req, res) => {
      try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
  
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
          return res.status(400).json({ messaage: "Status not allowed!" });
        }
  
        const connectionRequest = await ConnectionRequest.findOne({
          _id: requestId,
          toUserId: loggedInUser._id,
          status: "interested",
        });
        console.log(loggedInUser._id)
  
        if (!connectionRequest) {
          return res
            .status(404)
            .json({ message: "Connection request not found" });
        }
  
        connectionRequest.status = status;
        
        const data = await connectionRequest.save();
  
        res.json({ message: "Connection request " + status, data });
      } catch (err) {
        res.status(400).send("ERROR: " + err.message);
      }
    }
  );

module.exports = requestRouter