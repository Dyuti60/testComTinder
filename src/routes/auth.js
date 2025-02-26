const express = require('express')
const {User} = require('../models/user')
const {validateSignUpData} = require('../utils/validation')
const bcrypt = require('bcrypt')
const authRouter = express.Router()
const validator = require('validator')

authRouter.post('/signup', async (req, res) => {
    //Validating Data
    try{
        validateSignUpData(req)
        // Encrypt Password
        const {password} = req.body
        const passwordHash = await bcrypt.hash(password, 10)
        // Creating a new instace of user Model
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailId: req.body.emailId,
            password: passwordHash,
        })
            await user.save()
            res.json({
                message: `${user.firstName} ${user.lastName} signed up successfully`})
    }catch(err){
        res.status(500).send("ERROR: "+err.message)
    }
})
authRouter.post('/login',async(req,res)=>{
    try{
        const {emailId, password} = req.body
        //Sanitize the email
        if(!validator.isEmail(emailId)){
            throw new Error('Invalid email: '+emailId)
        }
        // Get the pasword hash from db for the email id
        const user = await User.findOne({
            emailId: emailId
        })
        if (!user){
            throw new Error('Invalid Credentials')
        }
        const isPasswordvalid = await user.getPasswordVerified(password)
        if (!isPasswordvalid){
            throw new Error('Invalid Credentials')
        }else{
            const token = await user.getJWT()
            res.cookie('token',token, {expires: new Date(Date.now()+1*3600000)})
            res.json({
                message:`${user.firstName} ${user.lastName} logged in successfully`
            })
        }
    }catch(err){
        res.status(400).send("Error logging in: "+err.message)
    }
})
authRouter.post('/logout', async(req, res) => {
    //res.clearCookie('token')
    res.cookie('token',null,{expires: new Date(Date.now())})
    res.send({
        message: `User logged out successfully`
    })
})
module.exports = {authRouter}