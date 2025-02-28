const mongoose = require('mongoose');
const connectionRequestSchema = mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status:{
        type: String,
        required: true,
        enum: {
            values:["ignored","interested","accepted","rejected"],
            message:'{VALUE} has invalid status type'
        }
    }
},{
    timestamps: true
})
// Compound Index
connectionRequestSchema.index({
    fromUserId: 1,
    toUserId: 1
})

// pre schema validation
connectionRequestSchema.pre("save",function(){
    const connectionRequest = this
    // check if the fromUserId is same as the toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself")
    }
    next()
})

const connectionRequestModel = new mongoose.model("connectionRequest",connectionRequestSchema)
module.exports = {connectionRequestModel}