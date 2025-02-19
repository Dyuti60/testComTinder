const express = require('express');
// Create an express server application
const app = express()

app.get('/user',(req,res)=>{
    res.send({
        name: "Dyuti",
        age: 26,
        location: "India"
    })
})
app.post('/user',(req,res)=>{
    res.send("User created successfully in database")
})
app.patch('/user',(req,res)=>{
    res.send("User updated successfully in database")
})
app.delete('/user',(req,res)=>{
    res.send("User deleted successfully from database")
})
app.use('/test/:testId/:testDesc',(req,res)=>{
    console.log(req.params)
    res.send("Hello from Test")
})

app.use('/',(req,res)=>{
    res.send("Namaste Dyuti")
})

// Create a server and listen to port 3000
app.listen(7777,()=>{
    console.log('Server is running on port 7777')
})