const jwt = require('jsonwebtoken')
const {User} = require('../models/user')

const userAuth = async (req,res,next)=>{
    // Job of this middleware is:
    // Read the token from the request cookies
    // Validate the token
    // Find the user
    try{
        const {token} = req.cookies
        if (!token) throw new Error('Invalid token')
        const decodedMessage = await jwt.verify(token,"TestCommTinder$18June")
        const user = await User.findOne({
            _id: decodedMessage._id,
        })
        if (!user) throw new Error('User not found')
        req.user = user
        next()
    }catch(err){
        res.status(403).send('Unauthorized Access: '+err.message)
    }
}
module.exports ={userAuth}