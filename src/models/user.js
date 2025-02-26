const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
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
        immutable: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email: "+value )
            }
        }

    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password must be at least 8 characters long, contain a uppercase letter, a lowercase letter, a number, and a special character: "+value)
            }
        }
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
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL: "+value )
            }
        },
        default: "https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg"
    },
    about:{
        type: String,
        default: 'This is a default about of the user'
    },
    skills:{
        type: [String]
    }
},{
    timestamps:true
})

userSchema.methods.getJWT = async function(){
    const user = this
    const token = jwt.sign({_id: user._id},"TestCommTinder$18June", {expiresIn:"1h"})
    return token
}
userSchema.methods.getPasswordVerified = async function(passwordInputValue){
    const user = this
    const passwordHash = user.password
    const isPasswordValid = await bcrypt.compare(passwordInputValue,passwordHash)
    return isPasswordValid
}
// Create Mongoose Model
const User = mongoose.model('User',userSchema)
module.exports = {User}