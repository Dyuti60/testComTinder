const express = require('express');
const {adminAuth} = require('./middleware/auth')
const {connectDb} = require('./config/database')
const {userModel} = require('./models/user')
// Create an express server application
const app = express()

// Middleware to parse JSON request bodies
app.use(express.json())

app.post('/signup', async (req, res) => {
    // Creating a new instace of user Model
    const user = new userModel(req.body)
    try{
        await user.save()
        res.send("User Added Succcessfully")
    }catch(err){
        console.error(err.message)
        res.status(500).send("Eror savinng the user: "+err.message)
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
        console.err("Database connection error")
    })

