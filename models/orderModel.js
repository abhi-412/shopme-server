const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    
    items:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true,
            },
            color:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Color",
                required:true,
            },
            count:{
                type:Number,
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            size:String,
        },
    ],

    shippingInfo:{
        address:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Address",
        },
        customerName:String,
        phoneNumber:String,
    },
    paymentMethod:{
        type:String,
        enum:["Cash on Delivery","Card","UPI"],
        default:"Cash on Delivery"
    },
    paymentInfo:{
        razorpayOrderID:{
            type:String,
            required:true
        },
        razorpayPaymentID:{
            type:String,
            required:true
        },
        // razorpaySignature:String
    },
    orderStatus:{
        type:String,
        default:"Not Processed",
        enum:["Not Proccessed","Proccessing",
        "Dispatched","Cancelled","Delivered","Cash on Delivery"]
    },
    orderBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    paidOn:{
        type:Date,
        default:Date.now()
    },
    totalPrice:{
        type:Number,
        required:true
    },
    totalAfterDiscount:{
        type:Number,
        required:true
    },
},

{
    timestamps:true,
},
);

//Export the model
module.exports = mongoose.model('Order', orderSchema);