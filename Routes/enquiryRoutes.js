const express = require('express')
const router = express.Router();
const { createEnquiry, updateEnquiry, deleteEnquiry, getEnquiry, getEnquiries } = require('../controllers/enquiryCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');


router.get('/',authMiddleware,isAdmin,getEnquiries),
router.post('/',authMiddleware,createEnquiry);
router.get('/:id',authMiddleware,getEnquiry)
router.put('/:id',authMiddleware,updateEnquiry)
router.delete('/:id',authMiddleware,isAdmin,deleteEnquiry)

module.exports = router;