
const express = require('express')

const router = express.Router();
const { uploadImages, deleteImages } = require('../controllers/uploadCtrl');
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware');

const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');

router.post('/',
authMiddleware,
isAdmin,
uploadPhoto.any(),
productImgResize,
uploadImages)

router.delete('/delete-img/:id',authMiddleware,isAdmin, deleteImages)

module.exports = router;