const asyncHandler = require('express-async-handler')
const Brand = require('../models/BrandModel')
const validateMongodbId = require('../utils/validatemongodbID')


const createBrand = asyncHandler(async(req,res)=>{
    try{
        const newBrand = await Brand.create(req.body)
        res.json(newBrand)

    }catch(error){
        throw new Error(error);
    }
})

const updateBrand = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id)
    try{
        const updatedBrand = await Brand.findByIdAndUpdate(id,req.body,{
            new:true,
        })
        res.json(updatedBrand)
    }catch(error){
        throw new Error(error);
    }
})

const getBrand = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id)
    try{
        const brand = await Brand.findById(id)
        res.json(brand)

    }catch(error){
        throw new Error(error);
    }
})

const getBrands = asyncHandler(async(req,res)=>{
    try{
        const brands = await Brand.find()
        res.json(brands)

    }catch(error){
        throw new Error(error);
    }
})

const deleteBrand = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id)
    try{
        const deletedBrand = await Brand.findByIdAndDelete(id)
        res.json(deletedBrand)

    }catch(error){
        throw new Error(error);
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
        
        const findBrand = await Brand.findByIdAndUpdate(id,
            {
                images:urls.map((file)=>{
                    return file;
                })
            },
            {
                new:true
            }
        );
        res.json(findBrand)

    }catch(error){
        throw new Error(error)
    }

})


module.exports = {createBrand,updateBrand,deleteBrand,
    getBrand,getBrands,uploadImages}