const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    
    products:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Product",
            },
            color:String,
            count:Number,
        },
    ],
    COD:Boolean,
    paymentIntent:{},
    orderStatus:{
        type:String,
        default:"Not Processed",
        enum:["Not Proccessed","Proccessing",
        "Dispatched","Cancelled","Delivered","Cash on Delivery"]
    },
    orderBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},
{
    timestamps:true,
},
);

//Export the model
module.exports = mongoose.model('Order', orderSchema);