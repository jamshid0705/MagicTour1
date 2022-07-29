const express=require('express')
const Router=express.Router()

const viewController=require('../controller/viewController')

Router.route('/overview').get(viewController.getAllTour)
Router.route('/tour/:id').get(viewController.getIdTour)
Router.route('/login').get(viewController.login)

module.exports=Router