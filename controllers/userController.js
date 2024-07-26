
const User = require('../models/UserModel.js')
const mongoose = require('../config/dbConnect.js')
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwtToken.js');
const validateMongodbId = require('../utils/validatemongodbID.js');
const {generateRefreshToken} = require('../config/refreshtoken.js');
const  jwt = require('jsonwebtoken');
const sendMail = require('./emailCtrl.js');
const { token } = require('morgan');
const crypto = require('crypto');
const uniqid = require('uniqid')

const Order = require('../models/orderModel.js')
const Product = require('../models/ProductModel.js');
const Cart = require('../models/cartModel.js');
const Coupon = require('../models/CouponModel.js');


const createUser = asyncHandler( async(req,res)=>{
    const email = req.body.email;
    const findUser = await User.findOne({ email: email })
    if(!findUser){
        const newUser = await User.create(req.body)
        res.json(newUser);
    }else{
        throw new Error('User Already Exists')
    }
} )

const userLoginController = asyncHandler(
    async(req,res)=>{
        const {email,password} = req.body;
        const findUser = await User.findOne({ email })

        if(findUser && await(findUser.isPasswordsMatched(password))){
            const refreshToken = await generateRefreshToken(findUser?.id);
            const updatedUser = await User.findByIdAndUpdate(findUser.id,{
                refreshToken:refreshToken
            },{new:true}) ;
            res.cookie('refresh',refreshToken,{
                httpOnly:true,
                maxAge:72*60*60*1000
            })
            res.json({
                _id: updatedUser?.id,
                firstName: updatedUser?.firstName,
                lastName:updatedUser?.lastName,
                email:updatedUser?.email,
                mobile:updatedUser?.mobile,
                token:generateToken(updatedUser?.id),
                wishlist:updatedUser?.wishlist,
                cart:updatedUser?.cart,
                orders:updatedUser?.orders

            })
        }else{
            throw new Error("Invalid Credentials")
        }
    }
)


///admin login 

const adminLogin = asyncHandler(
    async(req,res)=>{
        const {email,password} = req.body;
        const findAdmin = await User.findOne({ email })
        if(findAdmin.role !== 'admin') throw new Error("Not Authorized")

        if(findAdmin && await(findAdmin.isPasswordsMatched(password))){
            const refreshToken = await generateRefreshToken(findAdmin?.id);
            const updatedUser = await User.findByIdAndUpdate(findAdmin.id,{
                refreshToken:refreshToken
            },{new:true});
            res.cookie('refresh',refreshToken,{
                httpOnly:true,
                maxAge:72*60*60*1000
            })
            res.json({
                _id: findAdmin?.id,
                firstName: findAdmin?.firstName,
                lastName:findAdmin?.lastName,
                email:findAdmin?.email,
                mobile:findAdmin?.mobile,
                token:generateToken(findAdmin?.id)
            })
        }else{
            throw new Error("Invalid Credentials")
        }
    }
)

////
const getAllUsers = asyncHandler(async(req,res)=>{
    try{
        const getUsers = await User.find()
        console.log(User.find());
        res.json(getUsers)
    }catch(error){
        throw new Error(error);
    }
})

const getOneUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id)
    try{
        const foundUser = await User.findById(id)
        res.json(foundUser)
    }catch(error){
        throw new Error(error)
    }
    
})

const deleteUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id)
    try{
        const deletedUser = await User.findByIdAndDelete(id)
        res.json(deletedUser)
    }catch(error){
        throw new Error(error)
    }
    
})

//address///

const saveAddress = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    validateMongodbId(_id)
    try{
        const updatedUser = await User.findByIdAndUpdate(
            _id,{
            address: req?.body?.address,
        },
        {
            new:true,
        })
        res.json(updatedUser)
    }catch(error){
        throw new Error(error)
    }
    
})



const handleRefreshToken = asyncHandler(async(req,res)=>{
    const cookie = req.cookies;
    if(!cookie?.refresh) throw new Error("No Refresh token in cookies")

    const refreshToken = cookie.refresh;
    const user = await User.findOne({refreshToken})
    if(!user) throw new Error("No refresh token in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET,(err,decoded)=>{
        if(err || user.id !== decoded.id){
            throw new Error("Something is wrong with refresh token")
        }
        const accessToken = generateToken(user?.id)
        res.json(accessToken)
    })
})


const logout = asyncHandler(async(req,res)=>{
    const cookie = req.cookies;
    if(!cookie?.refresh) throw new Error("No Refresh token in cookies")
    const refreshToken = cookie.refresh;
    const user = await User.findOne({refreshToken})

    if(!user){
        res.clearCookie('refresh',{
            httpOnly:true,
            secure:true
        })
        return res.status(204);
    }
    await User.findOneAndUpdate(user._id,{
        refreshToken:"",
    });
    res.clearCookie('refresh',{
        httpOnly:true,
        secure:true
    });
    return res.sendStatus(204)
})


const updateUser = asyncHandler(asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    validateMongodbId(_id)
    try{
        const updatedUser = await User.findByIdAndUpdate(
            _id,{
            firstName: req?.body?.firstName,
            lastName:req?.body?.lastName,
            email:req?.body?.email,
            mobile:req?.body?.mobile,
        },
        {
            new:true,
        })
        res.json(updatedUser)
    }catch(error){
        throw new Error(error)
    }
}))



const blockUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id)
    try{
        const block = await User.findByIdAndUpdate(
        id,{
            isBlocked:true
        },
        {
            new:true,
        })
        res.json(block)
    }catch(error){
        throw new Error(error)
    }
})

const unblockUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id)
    try{
        const unblock = await User.findByIdAndUpdate(
            id,{
            isBlocked:false
        },
        {
            new:true, 
        })
        res.json({
            message:"User Unblocked"
        })
    }catch(error){
        throw new Error(error)
    }
})


const forgetPasswordToken=asyncHandler(async(req,res)=>{
    const {email} = req.body;
    const user = await User.findOne({email})
    if(!user){
        throw new Error("No user With this Email")
    }else{
        try{ 
            const resetToken = await user.createPasswordResetToken();
            await user.save();
            res.json(resetToken)
            const resetURL = `Hi, Please follow this link to reset your password. This link is walid for 10 minutes <a href="http://localhost:5000/api/user/reset-password/${resetToken}" =>Click here</a>`
            const data={
                to:email,
                text:"Hey User",
                subject:"Forgot Password Link",
                htm:resetURL
            }
            sendMail(data)
            res.json(resetToken)
        }catch(error){
            throw new Error(error);
        }
    }
   
})



const updatePassword = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    const {password} = req.body;
    validateMongodbId(_id);
    const user = await User.findById(_id)
    if(password){
        user.password = password;
        const updatedpassword = await user.save()
        res.json(updatedpassword)
    }else{
        res.json(user)
    }
})



const resetPassword = asyncHandler(async(req,res)=>{
    const {token} = req.params;
    const {password} = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
    const user = await User.findOne({
        passwordResetToken:hashedToken,
        passwordResetExpires:{ $gte:Date.now() }
    });
    if(!user) throw new Error("Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken=undefined;
    user.passwordResetExpires = undefined;
    await user.save()
    res.json(user)
})


const getWishList = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    // const {prodId} = req.body;
    try{
        const findUser = await User.findById(_id).populate('wishlist');
        res.json(findUser.wishlist)
    }catch(error){
        throw new Error(error)
    }
})


const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;
    validateMongodbId(_id);

    try {
        const user = await User.findById(_id);
        let existingCart = await Cart.findOne({ orderBy: user._id });
        let products = [];

        if (existingCart) {
            // Filter out products that are in the new cart
            const productIds = cart.map(p => p._id);
            const existingProductIds = existingCart.products.map(p => p.product.toString());

            existingCart.products = existingCart.products.filter(
                (product) => !productIds.includes(product.product.toString())
            );

            // Add new products to the cart
            for (let i = 0; i < cart.length; i++) {
                if(!existingProductIds.includes(cart[i]._id.toString())){
                    let Obj = {};
                    Obj.product = cart[i]._id;
                    Obj.count = cart[i].count;
                    Obj.color = cart[i].color;
                    Obj.size = cart[i].size;
                    let getPrice = await Product.findById(cart[i]._id).select("price").exec();
                    Obj.price = getPrice ? getPrice.price : 0;
                    products.push(Obj);
                }
            }

            existingCart.products.push(...products);
        } else {
            existingCart = new Cart({ orderBy: user._id, products: [] });

            for (let i = 0; i < cart.length; i++) {
                let Obj = {};
                Obj.product = cart[i]._id;
                Obj.count = cart[i].count;
                Obj.color = cart[i].color;
                Obj.size = cart[i].size;
                let getPrice = await Product.findById(cart[i]._id).select("price").exec();
                Obj.price = getPrice ? getPrice.price : 0;
                products.push(Obj);
            }

            existingCart.products.push(...products);
        }

        // Calculate the total price of the cart
        let cartTotal = existingCart.products.reduce((total, item) => total + item.count * item.price, 0);
        existingCart.cartTotal = cartTotal;

        await existingCart.save();

        res.json(existingCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const userCart = await Cart.findOne({ orderBy: _id }).populate("products.product");
        // console.log(userCart);
        if (!userCart) {
            throw new Error("User cart not found!");
        }
        res.json(userCart);
    } catch (error) {
        throw new Error(error);
    }
});

const emptyCart = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    validateMongodbId(_id)
    try{
        const userCart = await Cart.findOneAndDelete({orderBy:_id},{})
        res.json({
            message:"Successfully Deleted",
            userCart});
    }catch(error){
        throw new Error(error);
    }
})

const applyCoupon = asyncHandler(async(req,res)=>{
    const {coupon} = req.body;
    const  {_id} = req.user;
    validateMongodbId(_id);
    const validCoupon = await Coupon.findOne({name:coupon})
    if(validCoupon===null){
        throw new Error("Invalid Coupon")
    }else{
        const user = await User.findById(_id);
        const {cartTotal} = await Cart.findOne({orderBy:user._id})
        .populate("products.product") 

        let totalAfterDiscount = cartTotal - ((cartTotal*validCoupon.discount)/100).toFixed(2)
        await Cart.findOneAndUpdate({orderBy:user._id},{totalAfterDiscount},
            {
                new:true
            }
        )
        res.json(totalAfterDiscount);
    }
})


const createOrder=asyncHandler(async(req,res)=>{
    const {COD,couponApplied} = req.body;
    const  {_id} = req.user;
    validateMongodbId(_id); 
    try{
        if(!COD) throw new Error("Create cash order failed")
        const user = await User.findById(_id);
        let userCart = await Cart.findOne({orderBy:user._id});
        let finalAmount = 0;

        if(couponApplied && userCart.totalAfterDiscount){
            finalAmount = userCart.totalAfterDiscount
        }else{
            finalAmount = userCart.cartTotal
        }

        let newOrder = await new Order({
            products:userCart.products,
            paymentIntent:{
                id:uniqid(),
                method:"COD",
                amount:finalAmount,
                status:"Cash on Delivery",
                created:Date.now(),
                currency:"usd"
            },
            orderBy:user._id,
            orderStatus:"Cash on Delivery",
        }).save();

        let update = userCart.products.map((item)=>{
            return{
                updateOne:{
                    filter: {_id:item.product._id},
                    update:{$inc:{quantity:-item.count,sold:+item.count}}
                }
            }
        })
        const updated = await Product.bulkWrite(update,{});
        res.json({
            message:"success"
        })

    }catch(error){
        throw new Error(error)
    }
})


const getOrder = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    validateMongodbId(_id)
    try{
        let orders = await Order.find({orderBy:_id}).populate("products.product").populate("orderBy").exec()
        res.json(orders)
    }catch(error){
        throw new Error(error)
    }
})

const getOrderByUserId = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id)
    try{
        let order = await Order.findOne({orderBy:id}).populate("products.product").populate("orderBy").exec();
        // console.log(order.products);
        res.json(order.products)
    }catch(error){
        throw new Error(error)
    }
})

const getOrders = asyncHandler(async(req,res)=>{
    try{
        let orders = await Order.find().populate("products.product").populate("orderBy").exec()
        res.json(orders)
    }catch(error){
        throw new Error(error)
    }
})


const updateOrderStatus = asyncHandler(async(req,res)=>{
    const {status} = req.body;
    const {id} = req.params;
    validateMongodbId(id);
   try{
        const updateStatus = await Order.findByIdAndUpdate(id,{
            orderStatus:status,
            paymentIntent:{
                status:status
            }
        },{
            new:true,
        })
        res.json(updateStatus)
   }catch(error){
        throw new Error(error)
   }
})


module.exports = {createUser,userLoginController,applyCoupon,
    getAllUsers,getOneUser,deleteUser,updateUser,createOrder,
    blockUser,unblockUser,handleRefreshToken,logout,getOrders,
    forgetPasswordToken,userCart,getUserCart,emptyCart,updateOrderStatus,
updatePassword,resetPassword,adminLogin,getWishList,saveAddress,getOrder,getOrderByUserId};  