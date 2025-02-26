const express = require('express');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const {adminAuth} = require('./middleware/auth')
const {connectDb} = require('./config/database')
const {User} = require('./models/user')
const {validateSignUpData} = require('./utils/validation')
const bcrypt = require('bcrypt')
const validator = require('validator')
// Create an express server application
const app = express()

// Middleware to parse JSON request bodies
app.use(express.json())
app.use(cookieParser())

app.post('/signup', async (req, res) => {
    //Validating Data
    try{
    validateSignUpData(req)
    // Encrypt Password
    const {password} = req.body
    const passwordHash = await bcrypt.hash(password, 10)
    console.log(passwordHash)
    // Creating a new instace of user Model
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
        password: passwordHash,
    })
        await user.save()
        res.send("User Added Succcessfully")
    }catch(err){
        res.status(500).send("ERROR: "+err.message)
    }

})
app.post('/login',async(req,res)=>{
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
        // get the pasword hash for the email id
        const passwordHash = user.password
        // Whethere password is correct for the email id
        const isPasswordvalid = await bcrypt.compare(password,passwordHash)
        if (!isPasswordvalid){
            throw new Error('Invalid Credentials')
        }else{
            // Generate JWT token
            const token = jwt.sign({_id: user._id},"TestCommTinder$18June")
            res.cookie('token',token)
            res.send(`${user.firstName} logged in successfully`)
        }
    }catch(err){
        res.status(400).send("Error logging in: "+err.message)
    }
})
app.get('/profile',async(req, res)=>{
    try{
        const {token} = req.cookies
        if (!token){
            throw new Error('Token not found')
        }
        //Validate token
        const decodedMessage = await jwt.verify(token,"TestCommTinder$18June")
        const profileData = await User.findOne({
            _id: decodedMessage._id
        })
        if (!profileData){
            throw new Error('User not found')
        }
        res.send(profileData)
    }catch(err){
        res.status(400).send("Unauthorized Access: "+err.message)
    }
})
// Get user by email
app.get('/userID',async (req,res)=>{
    try{
        const userId= req.body.userId
        const user = await User.findById(userId)
        if (user.length ==0){
            return res.status(404).send("User not found")
        }else{
            res.send(user)
        }
    }catch(err){
        console.error(err.message)
        res.status(400).send("Error fetching the user: "+err.message)
    }
})
app.get('/user',async (req,res)=>{
    const userEmail = req.body.emailId
    try{
        const user =await User.find({
            emailId: userEmail
        })
        if (user.length ==0){
            return res.status(404).send("User not found")
        }else{
            res.send(user)
        }
    }catch(err){
        console.error(err.message)
        res.status(400).send("Error fetching the user: "+err.message)
    }
})
app.get('/feed',async (req,res)=>{
    try{
    const userData = await User.find({})
    res.send(userData)
    }catch(err){
        console.error(err.message)
        res.status(404).send("Error fetching the feed: "+err.message)
    }
})
app.delete('/user',async (req,res)=>{
    try{
        const userId= req.body.userId
        console.log(userId)
        const user = await User.findByIdAndDelete(userId)
        if (!user){
            return res.status(404).send("User not found")
        }else{
            res.send("User deleted successfully")
        }
    }
    catch(err){
        console.log(err)
        res.status(400).send("Error deleting the user: "+err.message)
    }
})
app.patch('/user/:userId',async (req,res)=>{
    const userId= req.params?.userId
    const updateData = req.body
    try{
        const ALLOWED_UPDATES = ["photoUrl","about","gender","age","skills"]
        const isAllowedUpdates = Object.keys(updateData).every((k)=>ALLOWED_UPDATES.includes(k))
        
        if(!isAllowedUpdates){
            throw new Error("Update not allowed")
        }
        if (updateData.skills!=undefined){ 
            if(updateData?.skills.length>10){
                throw new Error("Skills length exceeded")
            }
        }

        const user = await User.findByIdAndUpdate({_id:userId}, updateData, {returnDocument:"after", runValidators:true})
        if (!user){
            throw new Error("User Id not found")
        }
        res.send("User updated successfully")
        
    }catch(err){
        console.error(err.message)
        res.status(404).send("Error updating the user: "+err.message)
    }
})
app.patch('/userByEmail',async (req,res)=>{
    try{
        const userEmail = req.body.emailId
        const updateData = req.body
        const query = {emailId:userEmail}
        const updatedData = await User.findOneAndUpdate(query,updateData,{returnDocument:'after', runValidators:true})
        if (!updatedData){
            return res.status(404).send("User Email not found")
        }else{
        res.send("User updated successfully")
        }
    }catch(err){
        console.error(err.message)
        res.status(404).send("Error updating the user by email: "+err.message)
    }
})
connectDb()
    .then(()=>{
        console.log("Database connected successfully")
        app.listen(7777,()=>{
            console.log('Server is running on port 7777')
        })
    })
    .catch((err)=>{
        console.error("Database connection error ",err)
    })

