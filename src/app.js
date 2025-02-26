const express = require('express');
const {adminAuth} = require('./middleware/auth')
const {connectDb} = require('./config/database')
const {User} = require('./models/user')
// Create an express server application
const app = express()

// Middleware to parse JSON request bodies
app.use(express.json())

app.post('/signup', async (req, res) => {
    // Creating a new instace of user Model
    const user = new User(req.body)
    try{
        await user.save()
        res.send("User Added Succcessfully")
    }catch(err){
        console.error(err.message)
        res.status(500).send("Eror savinng the user: "+err.message)
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
app.patch('/user',async (req,res)=>{
    try{
        const userId= req.body.userId
        const updateData = req.body
        const user = await User.findByIdAndUpdate({_id:userId}, updateData, {returnDocument:"after", runValidators:true})
        if (!user){
            return res.status(404).send("User Id not found")
        }else{
        res.send("User updated successfully")
        }
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

