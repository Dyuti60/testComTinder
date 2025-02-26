const express = require('express');
const {adminAuth} = require('./middleware/auth')
// Create an express server application
const app = express()


app.get("/admin/getAllData",adminAuth,(req,res)=>{
    try{
        throw new Error('Not implemented')
        res.send("All Data Sent")
    }catch(err){
        res.status(404).send(err.message)
    }
    
})
app.get("/admin/deleteUser",adminAuth,(req,res)=>{
    res.send("User Deleted")
})
app.get("/login",(req,res)=>{
    res.send("Admin Login Successfully")
})

app.use('/',(err,req,res,next)=>{
    res.status(500).send('Something went wrong')
})
// Create a server and listen to port 3000
app.listen(7777,()=>{
    console.log('Server is running on port 7777')
})