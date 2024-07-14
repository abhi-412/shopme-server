const Product = require('../models/ProductModel')
const asyncHandler = require('express-async-handler')
const slugify = require("slugify");

const User = require('../models/UserModel')
const { get } = require('../Routes/userRoutes');
const { validate } = require('../models/UserModel');
const fs = require('fs')
const validateMongodbId = require('../utils/validatemongodbID');


const createProduct = asyncHandler(async(req,res)=>{
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct)
    }catch(error){
        throw new Error(error)
    }
});

const updateProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const updatedProduct = await Product.findByIdAndUpdate(id,req.body,{
            new:true,
        });
        res.json(updatedProduct)
    }catch(error){
        throw new Error(error)
    }
});

const getProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const findProduct = await Product.findById(id);
        res.json(findProduct)

    }catch(error){
        throw new Error(error)
    }
})

const deleteProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const deletedProduct = await Product.findByIdAndDelete(id);
        res.json(deletedProduct)

    }catch(error){
        throw new Error(error)
    }
})



const getAllProducts = asyncHandler(async(req,res)=>{
    
    try{
        const queryObj = { ...req.query };
        const excludeFields = ['page','sort','limit','fields'];
        excludeFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);

        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`)
        
        let query = Product.find(JSON.parse(queryStr))


        //sorting

        if (req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        }else{
            query = query.sort('-createdAt')
        }

        
        // limiting fields

        if (req.query.fields){
            const fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)
        }else{
            query = query.select('-__v')
        }

        //pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page-1)*limit
        query = query.skip(skip).limit(limit)
        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip>=productCount) throw new Error("This page does not Exixt")
        }


        const product = await query
        res.json(product)
    }catch(error){
        throw new Error(error)
    }
})

const addToWishlist = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    const {productId} = req.body;
    try{
        const product = await Product.findById(productId)
        const user = await User.findById(_id);
        const prevAdded = user?.wishlist.find((id)=>id.toString()===productId)
        
        if(prevAdded){
            const updatedUser = await User.findByIdAndUpdate(_id,{
                $pull:{wishlist:productId}
            },{
                new:true,
            })
            res.json({
                _id:updatedUser?._id,
                wishlist:updatedUser?.wishlist
            })
        }else{
            const updatedUser = await User.findByIdAndUpdate(_id,{
                $push:{wishlist:productId}
            },{new:true})
            res.json({
                _id:updatedUser?._id,
                wishlist:updatedUser?.wishlist
            })
        }

    }catch(error){
        throw new Error(error)
    }
})


const rating = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    const {star,productId,comment} = req.body;
    try{

        const product = await Product.findById(productId);
        let prevRated =  product.ratings.find((userId)=>userId?.postedBy?.toString()===_id.toString())
        if(prevRated){
            const updatedRating = await Product.updateOne(
            {
                ratings:{$elemMatch:prevRated},
            },{
                $set:{"ratings.$.star":star,"ratings.$.comment":comment }
            },{
                new:true
            })
        }else{
            const newRating = await Product.findByIdAndUpdate(productId,{
                $push:{
                    ratings:{
                    star:star,
                    comment:comment,
                    postedBy:_id,
                }},
            },{
                new:true,
            })
        }


        const getAllRatings = await Product.findById(productId)
        let totalRatings = getAllRatings.ratings.length;
        let ratingSum = getAllRatings.ratings.map((it)=>it.star)
        .reduce((prev,curr) => prev + curr, 0);
        console.log(totalRatings, ratingSum);

        let finalRating = Math.round(ratingSum/totalRatings)

        const ratedProduct = await Product.findByIdAndUpdate(productId,{
            totalRating:finalRating
        },{
            new:true
        })
        res.json(ratedProduct)

    }catch(error){
        throw new Error(error);
    }
})








module.exports = {createProduct,getProduct,getAllProducts,
    updateProduct,deleteProduct,addToWishlist,rating}