const { query } = require('express');
// const fs = require('fs');
const Tour = require('../model/tourModel');
const FeatureApi = require('../utility/FeatureApi');
const multer = require('multer');
const sharp = require('sharp');
const catchError2=require('../utility/catchError2')

const catchError = require('../utility/catchError');

const multerStorage = multer.memoryStorage(); // bufer tezkor hotiraga saqlaydi

const filterImage = (req, files, cb) => {
  if (files.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new appError('Siz rasm yuklang !', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: filterImage,
});

const uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  {name: 'images', maxCount: 3,},
]);
///////// ressize image ///////////
const resizeImage =catchError2(async (req, res, next) => {
  if (req.files.imageCover) {
    const ext = req.files.imageCover[0].mimetype.split('/')[1];
    req.body.imageCover= `tour-${req.user.id}-${Date.now()}.${ext}`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(1500, 1000)
      .toFormat('jpeg')
      .jpeg({ quality: 90 }) // rasmni sifati
      .toFile(`${__dirname}/../public/img/tours/${req.body.imageCover}`);
   
  }
  if(req.files.images){
    const ext = req.files.images[0].mimetype.split('/')[1];
    req.body.images = [];

    req.files.images.map((val,key)=>{
      let imageName=`tour-${req.user.id}-${Date.now()}-${key+1}.${ext}`
      sharp(val.buffer)
      .resize(1500, 1000)
      .toFormat('jpeg')
      .jpeg({ quality: 90 }) // rasmni sifati
      .toFile(`${__dirname}/../public/img/tours/${imageName}`);
      req.body.images.push(imageName)
   
    })
  }
  return next()
});
//////////////////////////////////////////////////

const {
  getAll,
  getOne,
  add,
  update,
  deleteData,
} = require('../controller/handlerController');


const options = {
  path: 'guides',
};
const options2 = {
  path: 'reviews',
};

const getAllTour = (req, res, next) => {
  console.log(options2);
  getAll(req, res, next, Tour, options, options2);
};
// get id
const getIdTour = (req, res, next) => {
  getOne(req, res, next, Tour, options, options2);
};

// post

const addTour = (req, res, next) => {
  
  add(req, res, next, Tour);
};

// patch
const updateTour = (req, res, next) => {
  console.log(req.files);
  update(req, res, next, Tour);
};

//delete
const deleteTour = (req, res, next) => {
  deleteData(req, res, next, Tour);
};

////////////////////////////////// reviews tours /////////// xato usul ///////////////////////////////////////////////////////////////

// const getReviewByTour=catchError(async(req,res,next)=>{
//   const data=await Reviews.find({tour:req.params.id})

//   res.status(200).json({
//     status:'success',
//     results:data.length,
//     data:data
//   })
// })

// app.get('/api/v1/tours',getAllTour)
// app.get("/api/v1/tours/:id",getIdTour)
// app.patch('/api/v1/tours/:id',updateTour)
// app.delete('/api/v1/tours/:id',deleteTour)
// app.post("/api/v1/tours",addTour)

const aggregation = catchError(async (req, res) => {
  const tourAggre = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 1, $lte: 10 } } },
    {
      $group: {
        _id: '$difficulty',
        soni: { $sum: 1 },
        ortachaAver: { $avg: '$ratingsAverage' },
        maxAver: { $min: '$ratingsAverage' },
        minAver: { $max: '$ratingsAverage' },
      },
    },
    { $sort: { price: -1 } },
    { $addFields: { difficulty: '$_id' } },
    { $project: { _id: 0 } },
    { $limit: 2 },
  ]);

  res.status(200).json({
    status: 'success',
    data: tourAggre,
  });
});

const dataSort = catchError(async (req, res) => {
  const sortDataTour = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${req.params.year}-01-01`),
          $lte: new Date(`${req.params.year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        tourDates: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { monthDate: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { tourDates: -1 } },
    { $limit: 3 },
  ]);

  res.status(200).json({
    status: 'success',
    results: sortDataTour.length,
    data: sortDataTour,
  });
});

module.exports = {
  getAllTour,
  getIdTour,
  updateTour,
  deleteTour,
  addTour,
  aggregation,
  dataSort,
  uploadTourImages,
  resizeImage,
};
