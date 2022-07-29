const appError = require("../utility/appError");
const catchError = require("../utility/catchError");
const FeatureApi=require('../utility/FeatureApi')

const responseFunction=(res,statusCode,data)=>{
  if(Array.isArray(data)){
    res.status(statusCode).json({
      status:'success',
      results:data.length,
      data:data
    })
  }
  else{
    res.status(statusCode).json({
      status:'success',
      data:data
    })
  }
}

//////////////////// getAll ////////////////////////////

const getAll=catchError(async(req,res,next,Model,options,options2)=>{
  let datas
  
  if(options2){
   
    const query=new FeatureApi(req.query,Model).filter().sort().field().pagenation();
    const tour=query.AnswerQuery;
    datas=await tour.populate(options).populate(options2);
  }
  else if(options){
    const query=new FeatureApi(req.query,Model).filter().sort().field().pagenation();
    const tour=query.AnswerQuery;
    datas=await tour.populate(options);
  }
  else{
    console.log(options2);
    const query=new FeatureApi(req.query,Model).filter().sort().field().pagenation();
    const tour=query.AnswerQuery;
    datas=await tour;
  }
 
  responseFunction(res,200,datas) 
})


////////////////////// get one ////////////////////////
const getOne=catchError(async(req,res,next,Model,options,options2)=>{
  let data

  if(options2){
    data=await Model.findById(req.params.id).populate(options).populate(options2);
  }
  else if(options){
    data=await Model.findById(req.params.id).populate(options);
  }
  else{
    data=await Model.findById(req.params.id);
  }

  if(!data){
    return next(new appError('Bunday id lik user mavjud emas !',404));
  }

  responseFunction(res,200,data);
})


///////////////////// add ////////////////////////

const add=catchError(async(req,res,next,Model)=>{
 
  const data=await Model.create(req.body);

  responseFunction(res,200,data);
})


///////////////////// update /////////////

const update=catchError(async(req,res,next,Model)=>{
  const data=await Model.findByIdAndUpdate(req.params.id,req.body,{new:true,validator:true})
  
  if(!data){
    return next(new appError('Bunday id lik user mavjud emas !',404));
  }

  responseFunction(res,202,data);
})

///////////////// delete //////////////////


const deleteData=catchError(async(req,res,next,Model)=>{
  const data=await Model.findByIdAndDelete(req.params.id)
  if(!data){
    return next(new appError('Bunday id lik user mavjud emas !',404))
  }
  responseFunction(res,200,data)
})



module.exports={getAll,getOne,add,update,deleteData}

