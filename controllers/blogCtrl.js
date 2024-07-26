const Blog = require('../models/BlogModel');
const validateMongodbId = require('../utils/validatemongodbID');
const User = require('../models/UserModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify')
const cloudinaryUploadImg = require('../utils/cloudinary')
const fs = require('fs')


const createBlog = asyncHandler(async(req,res)=>{
    try{
        const newBlog = await Blog.create(req.body);
        res.json({
            status:"success",
            newBlog,
        })
    }catch(error){
        throw new Error(error)
    }
   
})


const getAllBlogs = asyncHandler(async(req,res)=>{
    try{
        const blogs = await Blog.find();
        res.json({
            status:"success",
            blogs,
        })

    }catch(error){
        throw new Error(error)
    }
})

const getBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id)
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const blog = await Blog.findById(id).populate({
            path: 'likes',
            select: '_id firstName lastName'
        }).populate({
            path: 'dislikes',
            select: '_id firstName lastName'
        });
        await Blog.findByIdAndUpdate(id,{
            $inc:{numViews:1}
        },{
            new:true,
        })
        res.json({blog})
    }catch(error){
        throw new Error(error)
    }
})

const updateBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id)
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const updatedBlog = await Blog.findByIdAndUpdate(id,req.body,{
            new:true,
        });
        res.json({
            status:"success",
            updatedBlog,
        })

    }catch(error){
        throw new Error(error)
    }
})

const deleteBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id)
    try{
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.json(deletedBlog)

    }catch(error){
        throw new Error(error)
    }
})

const likeBlog = asyncHandler(async(req,res)=>{
    const {blogId} = req.body;
    console.log(blogId);
    validateMongodbId(blogId)

    
    const blog = await Blog.findById(blogId)
    const loginUserId = req?.user?._id;
    const isLiked=blog?.isLiked;
    const disliked = blog?.isDisliked;
    const numViews = blog?.numViews;
    if(disliked){ 
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{dislikes:loginUserId},
            isDisliked:false,
            numViews:numViews-1,
            $push:{likes:loginUserId},
            isLiked:true,
        },{new:true});
        res.json(blog)
    }else if(isLiked){
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{likes:loginUserId},
            isLiked:false,
            numViews:numViews-1,
        },{new:true})
        res.json(blog)
    }else{
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $push:{likes:loginUserId},
            isLiked:true,
            numViews:numViews-1,
        },{new:true})
        res.json(blog)
    }
})


const dislikeBlog=asyncHandler(async(req,res)=>{
    const {blogId} = req.body;
    validateMongodbId(blogId)
    
    const blog = await Blog.findById(blogId)
    const loginUserId = req?.user?._id;
    const liked=blog?.isLiked;
    const disliked = blog?.isDisliked;
    const numViews = blog?.numViews;
    
    if(liked){ 
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{likes:loginUserId},
            isLiked:false,
            isDisliked:true,
            numViews:numViews-1,
            $push:{dislikes:loginUserId},
        },{new:true});
        res.json(blog)
    }
    else if(disliked){
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{dislikes:loginUserId},
            isDisliked:false,
            numViews:numViews-1,
        },{new:true})
        res.json(blog)
    }else{
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $push:{dislikes:loginUserId},
            isDisliked:true,
            numViews:numViews-1,
        },{new:true})
        res.json(blog)
    }
})

const uploadImages = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const uploader = (path)=>cloudinaryUploadImg(path,"images");
        const urls = [];
        const files = req.files;
        for(const file of files){
            const {path} = file;
            const newpath = await uploader(path);
            urls.push(newpath);
            fs.unlinkSync(path)
        }
        console.log(urls);
        
        const findBlog = await Blog.findByIdAndUpdate(id,
            {
                images:urls.map((file)=>{
                    return file;
                })
            },
            {
                new:true
            }
        );
        res.json(findBlog)

    }catch(error){
        throw new Error(error)
    }

})


module.exports = {createBlog,getAllBlogs,getBlog,updateBlog,deleteBlog,
likeBlog,dislikeBlog,uploadImages}