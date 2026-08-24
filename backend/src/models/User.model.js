const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        githubId :{
            type:Number,
            required:true,
            unique:true,
            inex:true
        },
        userName:{
            type:String,
            required:true,

        },

        avatarUrl:String,

        profileUrl:String,


        
    },
    {
        timestamps:true,
    }
)

module.exports = mongoose.model("User",userSchema);