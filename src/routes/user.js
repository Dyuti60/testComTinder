const express = require('express')
const {userAuth} = require('../middleware/auth')
const {connectionRequestModel} = require('../models/connectionRequest')
const {User} = require('../models/user')
const userRouter = express.Router()

userRouter.get('/user/feeds',userAuth,async(req,res)=>{
    try{
        // const invalidConnectionRequest = await connectionRequestModel.find({
        //     $and:[
        //         {$or:[
        //             {status: "accepted"},
        //             {status: "rejected"},
        //             {status: "interested"},
        //             {status: "ignored"}
        //             ]
        //         },
        //         {
        //             fromUser: req.user._id
        //         }
        //     ]
        // })
        const userFeed = await User.find({})

        if (userFeed.length <=0) {
            return res.status(404).json({message: "No User Profiles available in the feed"})
        }else{
            res.json({
                message: "All User Profiles fetched successfully",
                data: userFeed
            })
        }
    }catch(err){
        res.status(400).json({message: `Error: ${err.message}`})
    }
})
userRouter.get('/user/request/sent',userAuth,async(req,res)=>{
    try{
        const userInterestedInConnections = await connectionRequestModel.find({
            $and:[
                {status: "interested"},
                {fromUserId: req.user._id.toString()}
            ]
        })
        if (userInterestedInConnections.length > 0){
            res.json({
                message: `All Connection Requests Sent by ${req.user.firstName} ${req.user.lastName} fetched successfully`,
                data: userInterestedInConnections
            })
        }else{
            res.status(404).json({message: `No Connection Request Sent by ${req.user.firstName} ${req.user.lastName}`})
        }
    }catch(err){
        res.status(400).json({message: `Error: ${err.message}`})
    }
})
userRouter.get('/user/request/ignored',userAuth,async(req,res)=>{
    try{

        const userConnectionsIgnored = await connectionRequestModel.find({
            $and:[
                {status: "ignored"},
                {fromUserId: req.user._id.toString()}
            ]
        })
        if(userConnectionsIgnored.length>0){
            res.json({
                message: `All Connection Requests Ignored by ${req.user.firstName} ${req.user.lastName} fetched successfully`,
                data: userConnectionsIgnored
            })
        }else{
            res.status(404).json({message: `No Connection Request Ignored by ${req.user.firstName} ${req.user.lastName}`})
        }
    }catch(err){
        res.status(400).json({message: `Error: ${err.message}`})
    }
})
userRouter.get('/user/request/received/otherInterested',userAuth,async(req,res)=>{
    try{
        const userConnectionsReceived = await connectionRequestModel.find({
            $and:[
                {toUserId: req.user._id},
                {status: "interested"}
            ]
        })
        if (userConnectionsReceived.length > 0){
            res.json({
                message: `Users who have shown interest on ${req.user.firstName} ${req.user.lastName} profile fetched successfully`,
                data: userConnectionsReceived
            })
        }else{
            res.status(404).json({message: `No user have shown interest on ${req.user.firstName} ${req.user.lastName} profile`})
        }
    }catch(err){
        res.status(400).json({message: `Error: ${err.message}`})
    }
})
userRouter.get('/user/request/received/otherIgnored',userAuth,async(req,res)=>{
    try{
        const userConnectionsReceived = await connectionRequestModel.find({
            $and:[
                {toUserId: req.user._id},
                {status: "ignored"}
            ]
        })
        if (userConnectionsReceived.length > 0){
            res.json({
                message: `Users who ignored ${req.user.firstName} ${req.user.lastName} profile fetched successfully`,
                data: userConnectionsReceived
            })
        }else{
            res.status(404).json({message: `No user ignored profile of ${req.user.firstName} ${req.user.lastName}`})
        }
    }catch(err){
        res.status(400).json({message: `Error: ${err.message}`})
    }
})
userRouter.get('/user/request/received/accepted',userAuth,async(req,res)=>{
    try{
        const userConnectionsReceivedAccepted = await connectionRequestModel.find({
            $and:[
                {status: "accepted"},
                {toUserId: req.user._id}
            ]
        })
        if (userConnectionsReceivedAccepted.length > 0){
            res.json({
                message: `All Connection Requests Received, Accepted by ${req.user.firstName} ${req.user.lastName} fetched successfully`,
                data: userConnectionsReceivedAccepted
            })
        }else{
            res.status(404).json({message: `No Connection Requests Received by ${req.user.firstName} ${req.user.lastName} Accepted`})
        }
    }catch(err){
        res.status(400).json({message: `Error: ${err.message}`})
    }
})
userRouter.get('/user/request/received/rejected',userAuth,async(req,res)=>{
    try{
        const userConnectionsIgnored = await connectionRequestModel.find({
            $and:[
                {status: "rejected"},
                {toUserId: req.user._id}
            ]
        })
        if(userConnectionsIgnored.length>0){
            res.json({
                message: `All Connection Requests Received, Ignored by ${req.user.firstName} ${req.user.lastName} fetched successfully`,
                data: userConnectionsIgnored
            })
        }else{
            res.status(404).json({message: `No Connection Request Received by ${req.user.firstName} ${req.user.lastName} Rejected`})
        }
    }catch(err){
        res.status(400).json({message: `Error: ${err.message}`})
    }
})

module.exports = {userRouter}