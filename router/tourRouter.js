const express = require('express');

const Tour = require('../controller/tourController');
const auth=require('../controller/authController')

const reviewRout=require('./reviewRouter')

const tourRouter = express.Router();

// app.param
// tourRouter.param('id',Tour.chekId) // middleware
tourRouter.route('/aggregate').get(auth.role,Tour.aggregation)
tourRouter.route('/aggregate/:year').get(auth.role,Tour.dataSort)

tourRouter.route('/').get(Tour.getAllTour).post(auth.protect,Tour.addTour);

// tourRouter.route('/:id/reviews').get(Tour.getReviewByTour) //xato usul

tourRouter.use('/:id/reviews',reviewRout)

tourRouter
  .route('/:id')
  .get(Tour.getIdTour)
  .patch(auth.protect, Tour.uploadTourImages, Tour.resizeImage, Tour.updateTour)
  .delete(auth.role(['admin', 'lead-guide']), Tour.deleteTour);




module.exports = tourRouter;
