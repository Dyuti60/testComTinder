const validator = require('validator')
const validateSignUpData = (req)=>{
    const {firstName, lastName, emailId, password} = req.body
    if (!firstName && !lastName){
        throw new Error('Name is not valid')
    }
    if (!validator.isEmail(emailId)){
        throw new Error('Email is not valid')
    }
    if (!validator.isStrongPassword(password)){
        throw new Error('Password is not strong enough')
    }
}
const validateEditProfileData = (req)=>{
    const allowedUpdateFields = ['firstName','lastName','photoUrl','about','skills','gender']
    const isAllowedUpdates = Object.keys(req.body).every((k)=>allowedUpdateFields.includes(k))
    return isAllowedUpdates
}


module.exports ={validateSignUpData, validateEditProfileData}