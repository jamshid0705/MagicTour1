const Review=require('../model/reviews')
const appError=require('../utility/appError')
const catchError=require('../utility/catchError')

const {getAll,getOne,add,update,deleteData}=require('../controller/handlerController')


const options={
  path:'tour',
  select:"name"
}

const options2={
  path:'user',
  select:"name"
}

///////////// get all ////////////////

const getAllReview=((req,res,next)=>{
  let modelReview
  if(req.params.id){
    modelReview=Review.find({tour:req.params.id})
  }else{
    modelReview=Review
  }
  getAll(req,res,next,modelReview,options,options2)
})

///////////// add review ////////////////

const addReview=catchError(async(req,res,next)=>{
  let review
  if(!req.params.id){
    review=await Review.create(req.body)
  }
  else{
    const tourId=req.params.id
    review=await Review.create({
      review:req.body.review,
      rating:req.body.rating,
      tour:tourId,
      user:req.body.user,
    })
  }

  res.status(200).json({
    statsu:'success',
    data:review
  })
})

module.exports={addReview,getAllReview}