const express = require('express')
const router = express.Router();
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware')
const {createBlog, getAllBlogs, getBlog, updateBlog, 
    deleteBlog, likeBlog, dislikeBlog, uploadImages} = require('../controllers/blogCtrl');
const { blogImgResize, uploadPhoto } = require('../middlewares/uploadImages');

router.post('/',authMiddleware, createBlog)
router.put('/upload/:id',
authMiddleware,
isAdmin,
uploadPhoto.any(),
blogImgResize, 
uploadImages)

router.put('/likes',authMiddleware,likeBlog)
router.put('/dislike',authMiddleware,dislikeBlog)
router.get('/',getAllBlogs)
router.get('/:id',getBlog)
router.put('/:id',authMiddleware,updateBlog)
router.delete('/:id',authMiddleware,isAdmin,deleteBlog)


module.exports = router;