const express=require('express')
const langController=require('../controller/langController')
const authController=require('../controller/authController')
const Router=express.Router()

Router.route('/').get(authController.protect,langController.getAllWord).post(authController.protect,langController.addLang)
Router.route('/:id').get(authController.protect,langController.getOneLang).patch(authController.protect,langController.updateLang).delete(authController.protect,langController.deleteLang)

module.exports=Router