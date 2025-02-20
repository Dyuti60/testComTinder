const mongoose = require('mongoose');
// Create Schema
const userSchema = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String
    },
    password: {
        type: String
    },
    age: {
        type: String
    },
    gender: {
        type: String
    }
})
// Create Mongoose Model
const userModel = mongoose.model('User',userSchema)
module.exports = {userModel}