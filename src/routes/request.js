const express = require('express');
const {userAuth} = require('../middleware/auth')
const {User} = require('../models/user')
const {connectionRequestModel} = require('../models/connectionRequest');
const connectionRequestRouter = express.Router()
connectionRequestRouter.post('/request/send/:status/:toUserId',userAuth, async(req, res) => {
    try{
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status
        const toUserDetails = await User.findById(toUserId)
        const fromUserName = req.user.firstName + ' ' + req.user.lastName
        const toUserName = toUserDetails.firstName +' ' + toUserDetails.lastName
        // Validate toUserId
        if(!toUserDetails){
            return res.status(400).json({message:`${toUserId} not found`})
        }
        // Validate Status
        const allowedStatus = ["interested", "ignored"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type: "+status})
        }
        //Validate if existing connection
        const existingConnectionType1 = await connectionRequestModel.find({
                fromUserId:fromUserId, 
                toUserId:toUserId
        })
        if(existingConnectionType1.length > 0){
            return res.status(400).json({message:`Hi ${req.user.firstName} ${req.user.lastName}, you have already sent or ignored a connection request of ${toUserName}`})
        }
        const existingConnectionType2 = await connectionRequestModel.find({
                fromUserId:toUserId,
                toUserId:fromUserId
        })
        if(existingConnectionType2.length > 0){
            return res.status(400).json({message:`Hi ${req.user.firstName} ${req.user.lastName}, you already have a connection request interaction with ${toUserName}`})
        }
        // Validate connection can't be sent to themselves
        // if (fromUserId == toUserId){
        //     return res.status(400).json({message:`Hi ${req.user.firstName} ${req.user.lastName}, you can't send connection request to yourself`})
        // }
        const connectionRequest = new connectionRequestModel({
            fromUserId,
            toUserId,
            status
        })
        const connectionRequestData = await connectionRequest.save()

        let messageData
        if (status =="interested"){
             messageData = `${fromUserName} interested and sends connection request to ${toUserName}`
        }else if (status == "ignored"){
             messageData = `${fromUserName} ignores and declines sending connection request to ${toUserName}`
        }
        res.json({
            message: messageData,
            data: connectionRequestData
        })
    }catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
})
module.exports = {connectionRequestRouter}