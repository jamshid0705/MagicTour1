const appError=require('./appError')


const catchError=function(funksiya){
  const func=(req,res,next,Model, options, options2)=>{
    funksiya(req,res,next,Model, options, options2).catch(err=>next(new appError(err.message,404)))
  }
  return func
}

module.exports=catchError