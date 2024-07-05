const express = require('express')
const router = express.Router();
const { createColor, updateColor, deleteColor, getColors, getColor } = require('../controllers/colorCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');


router.post('/',authMiddleware,isAdmin,createColor);
router.get('/',getColors),
router.get('/:id',getColor)
router.put('/:id',updateColor)
router.delete('/:id',authMiddleware,isAdmin,deleteColor)

module.exports = router; 