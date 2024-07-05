const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,"../public/images"));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
      cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg")
    }
  })


  function checkfiletype(file, cb) {
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
  
    if(extname && mimetype) {
      return cb(null, true)
    } else {
      cb('images only!')
    }
  }

  const uploadPhoto = multer({ 
    storage: multerStorage,
    fileFilter: function(req, file, cb) {
        checkfiletype(file, cb)
      },
    limits:{ fieldSize:2000000}
 })

const productImgResize = async(req,res,next)=>{
    if(!req.files) return next();
    await Promise.all(
        req.files.map(async(file)=>{
            await sharp(file.path).resize(300,300).toFormat('jpeg').jpeg({
                quality:90
            }).toFile(`public/images/products/${file.filename}`)
            fs.unlinkSync(`public/images/products/${file.filename}`)
        })
    );
    next();
}

const blogImgResize = async(req,res,next)=>{
    if(!req.files) return next();
    await Promise.all(
        req.files.map(async(file)=>{
            await sharp(file.path).resize(300,300).toFormat('jpeg').jpeg({
                quality:90
            }).toFile(`public/images/blogs/${file.filename}`)
            fs.unlinkSync(`public/images/blogs/${file.filename}`)
        })
    );
    next();
}


const brandImgResize = async(req,res,next)=>{
  if(!req.files) return next();
  await Promise.all(
      req.files.map(async(file)=>{
          await sharp(file.path).resize(300,300).toFormat('jpeg').jpeg({
              quality:90
          }).toFile(`public/images/brands/${file.filename}`)
          fs.unlinkSync(`public/images/brands/${file.filename}`)
      })
  );
  next();
}


 module.exports = {uploadPhoto,blogImgResize,productImgResize,brandImgResize}
