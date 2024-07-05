const express = require('express')
const router = express.Router();
const { createCategory, updateCategory, deleteCategory, getCategories, getCategory } = require('../controllers/categoryCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');


router.post('/',authMiddleware,isAdmin,createCategory);
router.get('/',getCategories),
router.get('/:id',getCategory)
router.put('/:id',updateCategory)
router.delete('/:id',authMiddleware,isAdmin,deleteCategory)

module.exports = router;