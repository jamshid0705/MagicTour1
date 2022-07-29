const express=require('express')
const tourRouter=require('./router/tourRouter')
const userRouter=require('./router/userRouter')
const reviewRouter=require('./router/reviewRouter')
const viewRout=require('./router/viewRout')
const appError=require('./utility/appError')
const helmet=require('helmet') // http ni secureti sini kuchaytirish masalan header ni
const rateLimit=require('express-rate-limit') 
const sanitize=require('express-mongo-sanitize') //req ni bodyni himoyalash un masalan $ sinvili bn
const xss=require('xss-clean')  // html ichiga virus tiqib yubormoqchi bolsa ushlab qoladi 
const hpp=require('hpp') // url dagi hatolarni ushlaydi
const path=require('path')

const appErrorController=require('./controller/appErrorController')
const app=express();


//////////// rate limit /////////////////
const limiter=rateLimit({
  max:10,
  windowMs:1*60*1000,
  message:'Siz ko\'p so\'rov berib yubordingiz !'
})



/////////// middleware //////////////

app.use('/api',limiter)

app.use(helmet())

app.use(express.json({limit:'100kb'}))  // req sini o'lchamani belgilaydi

app.use(sanitize())

app.use(xss())

app.use(hpp())

app.set('view engine','pug')
app.set('views',path.join(__dirname,'views'))

app.use(express.static('public'))  // html fayllarini oqish un
// route0000
app.use('/',viewRout)
app.get('/home',(req,res)=>{
  console.log(req)
  res.status(200).render('base')
})
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter) 
app.use('/api/v1/reviews',reviewRouter) // middleware

app.all('*',function(req,res,next){
  //  const err={
  //   statusCode:404,
  //   status:'fail',
  //   message:'bunday page mavjud emas'
  //  }
  next(new appError('Bunday page mavjud emas',404))
})

app.use(appErrorController)

module.exports=app
// console.log(process.env)