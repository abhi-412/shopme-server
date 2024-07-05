const express = require('express');
const router = express.Router()
const { createCoupon, getCoupons, getACoupon, updateCoupon, deleteACoupon } = require('../controllers/couponCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.post('/',authMiddleware,isAdmin,createCoupon)
router.get('/',authMiddleware,isAdmin,getCoupons)
router.get('/:id',authMiddleware,getACoupon)
router.put('/:id',authMiddleware,isAdmin, updateCoupon)
router.delete('/:id',authMiddleware,isAdmin, deleteACoupon)

module.exports = router