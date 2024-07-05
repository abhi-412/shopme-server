const asyncHandler = require('express-async-handler')
const Coupon = require('../models/CouponModel')
const validateMongodbId = require('../utils/validatemongodbID')

const createCoupon = asyncHandler(async(req,res)=>{
    try{
        const newCoupon = await Coupon.create(req.body)
        res.json(newCoupon)
    }catch(error){
        throw new Error(error)
    }
})

const getCoupons = asyncHandler(async(req,res)=>{
    try{
        const coupons = await Coupon.find()
        res.json(coupons)
    }catch(error){
        throw new Error(error)
    }
})
const getACoupon = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id)
    try{
        const coupon = await Coupon.findById(id)
        res.json(coupon)
    }catch(error){
        throw new Error(error)
    }
})

const updateCoupon = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id)
    try{
        const updatedCoupon = await Coupon.findByIdAndUpdate(id,req.body,{
            new:true,
        })
        res.json(updatedCoupon)
    }catch(error){
        throw new Error(error)
    }
})
const deleteACoupon = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id)
    try{
        const deletedCoupon = await Coupon.findByIdAndDelete(id)
        res.json(deletedCoupon)
    }catch(error){
        throw new Error(error)
    }
})


module.exports = {createCoupon,getCoupons,getACoupon,updateCoupon,deleteACoupon}