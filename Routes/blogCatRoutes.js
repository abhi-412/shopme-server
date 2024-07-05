const express = require('express')
const router = express.Router();
const { createBlogCat, updateBlogCat, deleteBlogCat, getBlogCategories, getBlogCat } = require('../controllers/blogCategoryCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');


router.post('/',authMiddleware,isAdmin,createBlogCat);
router.get('/',getBlogCategories),
router.get('/:id',getBlogCat)
router.put('/:id',authMiddleware,isAdmin,updateBlogCat)
router.delete('/:id',authMiddleware,isAdmin,deleteBlogCat)

module.exports = router; 