const {connectDb} = require('./config/database')
const express = require('express')
const cookieParser = require('cookie-parser')
const {authRouter} = require('./routes/auth')
const {profileRouter} = require('./routes/profile')
const {connectionRequestRouter} = require('./routes/connectionRequest')

const app = express()

// Middleware to parse JSON request bodies and parse cookies
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',connectionRequestRouter)

// Connect to db and listen to port 7777
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