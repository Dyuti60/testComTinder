const express = require('express');
const {userAuth} = require('../middleware/auth');
const { User } = require('../models/user');
const {validateEditProfileData} = require('../utils/validation')
const bcrypt = require('bcrypt')
const profileRouter = express.Router()

profileRouter.get('/profile/view',userAuth,async(req, res)=>{
    try{
        const user = req.user
        res.json({
            message: `${user.firstName} ${user.lastName}'s profile fetched successfully`,
            data: user
        })
    }catch(err){
        res.status(400).send("Unauthorized Access: "+err.message)
    }
})
profileRouter.patch('/profile/edit',userAuth, async (req, res) => {
    try{
        const updatedData = req.body
        const isAllowedUpdates = validateEditProfileData(req)
        if(!isAllowedUpdates){
            throw new Error("Invalid update fields")
        }
        const query ={_id:req.user._id}
        const response = await User.findOneAndUpdate(query, updatedData, {returnDocument:'after', runValidators: true})
        //OR
        // const loggedInUser = req.user
        // Object.keys(req.body).forEach((key) => {loggedInUser[key] = req.body[key]})
        // await loggedInUser.save()

        if (!response){
             throw new Error("User not found")
         }
        res.json({
            message: `${response.firstName} ${response.lastName}'s profile updated successfully`,
            data: response
        })
    }catch(err){
        res.status(400).send("Error updating the profile: "+err.message)
    }
})
module.exports = {profileRouter}