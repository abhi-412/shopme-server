const asyncHandler = require('express-async-handler')
const BlogCat = require('../models/blogCatModel')
const validateMongodbId = require('../utils/validatemongodbID')


const createBlogCat = asyncHandler(async(req,res)=>{
    try{
        const newBlogCat = await BlogCat.create(req.body)
        res.json(newBlogCat)

    }catch(error){
        throw new Error(error);
    }
})

const updateBlogCat = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const updatedBlogCat = await BlogCat.findByIdAndUpdate(id,req.body,{
            new:true,
        })
        res.json(updatedBlogCat)

    }catch(error){
        throw new Error(error);
    }
})

const getBlogCat = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const blogCat = await BlogCat.findById(id)
        res.json(blogCat)

    }catch(error){
        throw new Error(error);
    }
})

const getBlogCategories = asyncHandler(async(req,res)=>{
    try{
        const blogcategories = await BlogCat.find()
        res.json(blogcategories)

    }catch(error){
        throw new Error(error);
    }
})

const deleteBlogCat = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const deletedBlogCat = await BlogCat.findByIdAndDelete(id)
        res.json(deletedBlogCat)

    }catch(error){
        throw new Error(error);
    }
})


module.exports = {createBlogCat,updateBlogCat,deleteBlogCat,
    getBlogCat,getBlogCategories}