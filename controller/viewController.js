const Reviews = require("../model/reviews");
const Tour = require("../model/tourModel");
const appError = require("../utility/appError");
const catchError = require("../utility/catchError2");

///////// get all ////////////////////
const getAllTour=catchError(async(req,res,next)=>{
  const data=await Tour.find()

  res.status(200).render('overview',{
    tour:data
  })
})

////////////// get id //////////////////
const getIdTour=catchError(async(req,res,next)=>{
  const data=await Tour.findById(req.params.id).populate('guides').populate('reviews')

  const rev=await Reviews.find({tour:req.params.id}).populate('user')
  console.log(rev)

  if(!data){
    return next(new appError('Bunday page mavjud emas !',404))
  }

  res.status(200).render('tour',{
    tour:data,
    review:rev
  })
})

////////////// login ////////////////////
const login=catchError(async(req,res,next)=>{
  res.status(200).render('login')
})

///////////// account ////////////
const account=catchError(async(req,res,next)=>{
  res.status(200).render('account')
})

////////////// sign up////////////////////
const signup=catchError(async(req,res,next)=>{
  res.status(200).render('signup')
})


module.exports={getAllTour,getIdTour,login,account,signup}