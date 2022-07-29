module.exports= function(err,req,res,next){
  err.statusCode=err.statusCode || 404;
  err.status=err.status || 'fail';
  err.message=err.message || 'Not found'

  if(err.message ==='invalid signature'){
    err.message='Sening tokening yaroqsiz'
  }

  if(process.env.NODE_ENV==='DEVELOPMENT'){

    if(req.originalUrl.startsWith('/api')){
      res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        statusCode:err.statusCode,
        stack:err.stack
      })
    }
    else{
      res.status(err.statusCode).render('error',{
        message:err.message
      })
    }
    
  }
  
  if(process.env.NODE_ENV==='PRODUCTION'){

    if(req.originalUrl.startsWith('/api')){
      res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
      })
    }else{
      res.status(err.statusCode).render('error',{
        message:"Iltimos yana urinib ko'ring !"
      })
    }
    
  }
}