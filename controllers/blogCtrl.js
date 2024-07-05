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
        const blog = await Blog.findById(id).populate('likes').populate('dislikes');
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
    validateMongodbId(blogId)
    
    const blog = await Blog.findById(blogId)
    const loginUserId = req?.user?._id;
    const isLiked=blog?.isLiked;
    const disliked = blog?.isDisliked;
    if(disliked){ 
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{dislikes:loginUserId},
            isDisliked:false,
            $push:{likes:loginUserId},
            isLiked:true,
        },{new:true});
        res.json(blog)
    }else if(isLiked){
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{likes:loginUserId},
            isLiked:false,
        },{new:true})
        res.json(blog)
    }else{
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $push:{likes:loginUserId},
            isLiked:true,
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
    
    if(liked){ 
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{likes:loginUserId},
            isLiked:false,
            isDisliked:true,
            $push:{dislikes:loginUserId},
        },{new:true});
        res.json(blog)
    }
    else if(disliked){
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{dislikes:loginUserId},
            isDisliked:false,
        },{new:true})
        res.json(blog)
    }else{
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $push:{dislikes:loginUserId},
            isDisliked:true,
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