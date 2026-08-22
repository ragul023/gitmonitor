const mongoose = require("mongoose")


const connectDb = async() =>{
    try{
        console.log("Mongo URI exists:", !!process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Db is connected successfully")
    }catch(error){
        console.log("Db connection failure :",error.message);
        process.exit(1);
    }
}

module.exports = connectDb;