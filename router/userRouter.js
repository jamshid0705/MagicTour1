const express=require('express')
const User=require('../controller/userController')
const auth=require('../controller/authController')

const userRouter=express.Router()
userRouter.route('/signup').post(auth.signup)
userRouter.route('/signin').post(auth.login)

userRouter.route('/forgotpassword').post(auth.forgotpassword)

userRouter.route('/resentPassword/:token').post(auth.resentPassword)

userRouter.route('/updatemepassword').patch(auth.protect,User.updateMePassword)

userRouter.route('/updateMeData').patch(auth.protect,User.updateMe)

userRouter.route('/').get(User.getAllUsers).post(auth.protect,User.addUsers)  // middlewarelar 
userRouter.route('/:id').patch(auth.protect,User.updateUsers).patch(auth.protect,User.getIdUsers).delete(auth.protect,auth.role(['admin','team-lead']),User.deleteUsers)

module.exports=userRouter