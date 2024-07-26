const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const cartSchema = new mongoose.Schema({

    products:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true,
            },
            color:String,
            count:Number,
            price:Number,
            size:String,
        },
    ],
    cartTotal:Number,
    totalAfterDiscount:"String",
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
module.exports = mongoose.model('Cart', cartSchema);