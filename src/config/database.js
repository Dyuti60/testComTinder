const mongoose = require('mongoose')

const connectDb = async ()=>{
    await mongoose.connect(
        'mongodb+srv://mfsidyutid:7PxRB53puvOSyX08@testcommtinder.vvert.mongodb.net/testTinder?tls=true')
        //'mongodb+srv://mfsidyutid:asnAUIc8skzipyWe@testcommtinder.vvert.mongodb.net/testTinder')
}

module.exports = {connectDb}