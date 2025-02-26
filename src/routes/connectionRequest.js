const express = require('express');
const {userAuth} = require('../middleware/auth')

const connectionRequestRouter = express.Router()
connectionRequestRouter.post('/sendConnectionRequest',userAuth, async(req, res) => {
    try{
        const fromUserId = req.user.firstName + ' ' + req.user.lastName
        const toUserId = req.body.toUserId
        res.send(`${fromUserId} sends connection request to ${toUserId}`)
    }catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
})
module.exports = {connectionRequestRouter}