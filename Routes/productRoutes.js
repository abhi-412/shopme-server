const express = require('express');
const { createProduct, getProduct,getAllProducts, 
    updateProduct, deleteProduct, addToWishlist, rating} = require('../controllers/productCtrl');
const router = express.Router();
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware');

router.post('/',authMiddleware,isAdmin,createProduct)


router.put('/wishlist',authMiddleware,addToWishlist)
router.put('/rating',authMiddleware,rating)
router.get('/:id',getProduct)
router.put('/:id',authMiddleware,isAdmin,updateProduct)
router.get('/',getAllProducts)
router.delete('/:id',authMiddleware,isAdmin, deleteProduct)


 

module.exports = router;