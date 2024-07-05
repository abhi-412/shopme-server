const express = require('express')
const router = express.Router();
const { createBrand, updateBrand, deleteBrand, getBrands, getBrand, uploadImages } = require('../controllers/brandCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { brandImgResize, uploadPhoto } = require('../middlewares/uploadImages');



router.post('/',authMiddleware,isAdmin,createBrand);
router.get('/',getBrands),
router.get('/:id',getBrand)
router.put('/:id',authMiddleware,isAdmin,updateBrand)
router.put('/upload/:id',
authMiddleware,
isAdmin,
uploadPhoto.any(),
brandImgResize,
uploadImages)
router.delete('/:id',authMiddleware,isAdmin,deleteBrand)


module.exports = router;