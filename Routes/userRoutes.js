const express = require("express")
const {createUser,userLoginController,
     getAllUsers, getOneUser, deleteUser,
      updateUser, blockUser, unblockUser,
       handleRefreshToken,
       logout,
       updatePassword,
       forgetPasswordToken,
       resetPassword,
       adminLogin,
       getWishList,
       saveAddress,
       userCart,
       getUserCart,
       emptyCart,
       applyCoupon,
       createOrder,
       getOrders,
       getOrder,
       updateOrderStatus,
       getOrderByUserId} = require('../controllers/userController.js')
const router = express.Router();

const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware.js')

 router.post('/register',createUser)
 router.put('/password/',authMiddleware,updatePassword)
 router.put('/order/update-order/:id',authMiddleware,isAdmin,updateOrderStatus)
 router.post('/login', userLoginController)
 router.post('/admin-login', adminLogin)
 router.post('/forgot-password-token',authMiddleware,forgetPasswordToken)
 router.post('/cart',authMiddleware,userCart)
 router.post('/cart/apply-coupon',authMiddleware,applyCoupon)
 router.post('/cart/cash-order',authMiddleware,createOrder)
 router.put('/reset-password/:token',resetPassword)
 router.get('/all-users',getAllUsers)
 router.get('/refresh', handleRefreshToken)
 router.get('/logout',logout)
 router.get('/wishlist',authMiddleware,getWishList)
 router.get('/get-cart',authMiddleware,getUserCart)
 router.get('/order',authMiddleware,getOrder)
 router.get('/orders/:id',authMiddleware,getOrderByUserId)
 router.get('/orders',authMiddleware,isAdmin,getOrders)

 router.get('/:id',authMiddleware,getOneUser)
 router.delete('/empty-cart',authMiddleware,emptyCart)

 router.delete('/:id',deleteUser)
 router.put('/save-address',authMiddleware,saveAddress)
 router.put('/edit-user',authMiddleware, updateUser);
 router.put('/block-user/:id', authMiddleware,isAdmin,blockUser)
 router.put('/unblock-user/:id', authMiddleware,isAdmin,unblockUser)

 

module.exports =  router;

