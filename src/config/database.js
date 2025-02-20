const mongoose = require('mongoose')

const connectDb = async ()=>{
    await mongoose.connect(
        'mongodb+srv://mfsidyutid:asnAUIc8skzipyWe@testcommtinder.vvert.mongodb.net/testTinder')
}

module.exports = {connectDb}