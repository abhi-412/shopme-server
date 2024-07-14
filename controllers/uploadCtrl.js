const fs = require('fs')
const {cloudinaryUploadImg,cloudinaryDeleteImg,checkResourceExists}= require('../utils/cloudinary')
const asyncHandler = require("express-async-handler")
const streamifier =require("streamifier");



const uploadImages = async(req, res)=> {
    await cloudinaryUploadImg(req, res);
    console.log(req.file.buffer);
    const stream = await cloudinary.uploader.upload_stream(
      {
        folder: "demo",
      },
      (error, result) => {
        if (error) return console.error(error);
        res.status(200).json(result);
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  }

// const uploadImages = asyncHandler(async(req,res)=>{
//     try{
//         const uploader = (path)=>cloudinaryUploadImg(path,"images");
//         const urls = [];
//         const files = req.files;
//         for(const file of files){
//             const {path} = file;
//             const newpath = await uploader(path);
//             urls.push(newpath);
//             fs.unlinkSync(path)
//         }
//         const images = urls.map((file)=>{
//             return file;
//         })
//         res.json(images)
//     }catch(error){
//         throw new Error(error)
//     }

// })


const deleteImages = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const result = await checkResourceExists(id);
        if(result){
            const deleter = await cloudinaryDeleteImg(id,"images");
            console.log(deleter);
            if(result && !deleter.url){
                res.json({
                    deleted_id:id,
                    message:"Deleted",
                    deleter
                })
            }else{
               res.status(404).json({
                message:"NOT FOUND"
               })
            }
        }
        
    }catch(error){
        throw new Error(error)
    }

})

module.exports = {
    deleteImages,uploadImages
}