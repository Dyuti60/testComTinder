const express = require('express')
const {userAuth} = require('../middleware/auth')
const {connectionRequestModel} = require('../models/connectionRequest')
const {User} = require('../models/user')
const userRouter = express.Router()
const USER_SAFE_DATA = "firstName lastName photoUrl age gender skills about"
userRouter.get('/registerdUsers',userAuth,async(req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 5
        if(limit>10){
            limit = 10
        }
        const skip =(page-1)*limit
        const userFeed = await User.find({}).select(USER_SAFE_DATA).skip(skip).limit(limit)

        if (userFeed.length <=0) {
            return res.status(404).json({message: "No User Profiles available in the feed"})
        }else{
            res.json({
                message: "All Registered User Profiles fetched successfully",
                data: userFeed
            })
        }
    }catch(err){
        res.status(400).json({message: `Error: ${err.message}`})
    }
})
userRouter.get('/user/feeds',userAuth,async(req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip =(page-1)*limit
        const filterOutConnections = await connectionRequestModel.find({
            $or:[
            {fromUserId:req.user._id},
            {toUserId: req.user._id}
            ]
            }
        ).select('fromUserId toUserId')
        const blockUsersFromFeed = new Set()
        filterOutConnections.forEach((row)=>{
            blockUsersFromFeed.add(row.fromUserId.toString()),
            blockUsersFromFeed.add(row.toUserId.toString())
        })
        const myConnectionFeed = await User.find({
            $and:[
            {_id: {$nin:Array.from(blockUsersFromFeed)}},
            {_id: {$ne:req.user._id}}
            ]
            }
        ).select(USER_SAFE_DATA).skip(skip).limit(limit)
        res.json({
            message: `Fetched all feeds`,
            data: myConnectionFeed
        })
    }catch(err){
        res.status(400).json({message: `Error: ${err.message}`})
    }
})
userRouter.get('/user/myConnections',userAuth,async(req,res)=>{
    try{
        const loginUserId = req.user._id
        const userConnections = await connectionRequestModel.find({
            status:"accepted",
            $or:[
                {toUserId: loginUserId},
                {fromUserId: loginUserId}
            ]
        }).populate('fromUserId',USER_SAFE_DATA).populate('toUserId',USER_SAFE_DATA)
        if(!userConnections){
            return res.status(404).json({message: "No Connections available"})
        }else{
            const data = userConnections.map((row)=>
                {
                if(row.toUserId._id.equals(req.user._id)){
                    return row.fromUserId
                }else if(row.fromUserId._id.equals(req.user._id)){
                    return row.toUserId
                }
            })
            res.json({
                message: `All Connections of ${req.user.firstName} ${req.user.lastName} fetched successfully`,
                data: data
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
        }).populate('toUserId',['firstName', 'lastName'])
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
        }).populate('toUserId',['firstName', 'lastName'])
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
        }).populate('fromUserId',['firstName', 'lastName'])
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
        }).populate('fromUserId',['firstName', 'lastName'])
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
        }).populate('fromUserId',['firstName', 'lastName'])
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
        }).populate('fromUserId',['firstName', 'lastName'])
        if(userConnectionsIgnored.length>0){
            res.json({
                message: `All Connection Requests Received, Rejected by ${req.user.firstName} ${req.user.lastName} fetched successfully`,
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