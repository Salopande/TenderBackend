const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();
const User = require('../models/user');

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested'
    }).populate("fromUserId", ["firstName", "lastName"])
    res.json({ message: "Data fetch successfully", data: connectionRequest })
  } catch (err) {
    res.status(400).send("Error" + err.message)
  }
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: 'accepted' },
        { fromUserId: loggedInUser._id, status: 'accepted' }
      ]
    }).populate("fromUserId", ["firstName", "lastName"]).populate("toUserId", ["firstName", "lastName"])

    const data = connectionRequest.map((row) => {
      if (row.fromUserId.toString() === loggedInUser._id.toString()) {
        return row.toUserId
      }
      return row.fromUserId
    })

    res.json({ message: 'Fetch Successfully', data })
  } catch (err) {
    res.status(400).send("Error" + err.message)
  }
})

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50:limit;
    const skip = (page - 1)*limit;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
    }).select("fromUserId, toUserId")
    
    const hideUserFromFeed = new Set();
    connectionRequest.forEach(req => {
      hideUserFromFeed.add(req.fromUserId)
      hideUserFromFeed.add(req.toUserId)
    })
    
    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } }
      ]
    }).select(["firstName", "lastName"]).skip(skip).limit(limit)
    console.log(user)
    res.send(user)

  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = userRouter