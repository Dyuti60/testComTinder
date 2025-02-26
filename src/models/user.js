const mongoose = require('mongoose');
// Create Schema
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength:4,
        maxLength:25
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim:true,
        immutable: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: String,
        min:18
    },
    gender: {
        type: String,
        validate(value){
            if (!["male","female","others"].includes(value)){
                throw new Error("Invalid Gender")
            }
        }
    },
    photoUrl:{
        type: String,
        default: "https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg"
    },
    about:{
        type: String,
        default: 'This is a default about of the user'
    },
    skills:{
        type: [String]
    }

},
{
    timestamps:true
})
// Create Mongoose Model
const User = mongoose.model('User',userSchema)
module.exports = {User}