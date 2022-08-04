const express=require('express')
const Router=express.Router()

const viewController=require('../controller/viewController')
const authController=require('../controller/authController')

Router.route('/').get(authController.isSignIn,viewController.getAllTour)
Router.route('/overview').get(authController.isSignIn,viewController.getAllTour)
Router.route('/tour/:id').get(authController.isSignIn,viewController.getIdTour)
Router.route('/login').get(viewController.login)
Router.route('/account').get(authController.protect,viewController.account)

Router.route('/logout').post(authController.logout)

module.exports=Router