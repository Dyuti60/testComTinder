const express = require('express');
// Create an express server application
const app = express()
app.use('/test',(req,res)=>{
    res.send("Hello from Test")
})
app.use('/hello',(req,res)=>{
    res.send("Hello hello hello")
})
app.use((req,res)=>{
    res.send("Hello from Server running")
})
// Create a server and listen to port 3000
app.listen(7777,()=>{
    console.log('Server is running on port 7777')
})