const mongoose = require('mongoose')

const dbConnect = ()=>{
    try{
        const connection = mongoose.connect(process.env.MONGODB_URL)
        console.log(process.env.MONGODB_URL)
        connection.then(()=>{console.log("connected to DB")})
    }catch(e){
        console.log("Database error")
    }
}

module.exports = dbConnect;




