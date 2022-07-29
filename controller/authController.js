const User = require("../model/userModel");
const catchError = require("../utility/catchError");
const jwt=require('jsonwebtoken');
const appError = require("../utility/appError");
const bcrypt=require('bcrypt');
const mail = require("../utility/mai");
const crypto=require('crypto')




/// create token
const createToken= function(id){
  return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
}

/////////// cookie /////////////
const saveTokenCookie=(token,res,req)=>{
  res.cookie('jwt',token,{
    maxAge:process.env.JWT_EXPIRES_DATA*24*60*60*1000,  // nechi kun berish vaqti token
    httpOnly:true,
    secure:req.protocol==='https'? true:false
  })
}


///////////////////////// sign up //////////////////////////

const signup= catchError(async(req,res,next)=>{
  const newUser=await User.create({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    role:req.body.role,
    passwordConfirm:req.body.passwordConfirm,
    passwordChangedDate:req.body.passwordChangedDate
  })

 const token=createToken(newUser._id)

 saveTokenCookie(token,res,req)

  res.status(200).json({
    status:'success',
    token:token,
    data:newUser
  })
})


//////////////////// sign in ///////////////////////////////////

const login=catchError(async(req,res,next)=>{
  // 1 email bn password borligini tekshirish
  const {email,password}=req.body
  if(!email || !password){
    return next(new appError('Siz email bn password kiritishingiz kerak!!!',404))
  }

  // 2 bunday user bor yo'qligini tekshirish

  const user=await User.findOne({email}).select('+password')  // select + bilan yozsak password olib keladi 

  if(!user){
    return next(new appError('Bunday user mavjud emas !!!',404))
  }
  // 3 password ni tekshirish
  const checkPassword=async function(pas,UserPassword){
    return await bcrypt.compare(pas,UserPassword)
  }

  if(!( await checkPassword(password,user.password))){
    
    return next(new appError('Password xato !!!',404))
  }

  // 4 JWT token berish
  const token=createToken(user._id)

  saveTokenCookie(token,res,req)
  // 5 javob qaytarish
  res.status(200).json({
    status:'success',
    token:token
  })

})


///////////////// middleware ///////////////////
const protect = catchError(async (req, res, next) => {
  // console.log(req.headers.authorization);

  // 1. Token bor yoqligini tekshirish headerdan

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token || token=='null') {
    return next(
      new appError('Siz birinchi royhatdan oting yoki tizimga kiring')
    );
  }

  // 2.Tokenni tekshirish user olib ketgan token bn serverni tokeni

    const tokencha=jwt.verify(token, process.env.JWT_SECRET);

    console.log(tokencha)
  // 3.Tokenni ichidan idni olib data basedagi userlarni id si bilan solishtirish

  const user=await User.findOne({_id:tokencha.id})
  if(!user){
    return next(new appError('Bunday user mavjud emas. Royhatdan otib kirin',401))
  }
  // 4. Agar parol o'zgargan bo'lsa tokenni amal qilmasligini tekshirish

  if(user.passwordChangedDate){
    console.log(tokencha.iat)
    console.log(user.passwordChangedDate.getTime()/1000)
    if(user.passwordChangedDate.getTime()/100>tokencha.iat){
      return next(new appError('Sizning tokeningiz yaroqsiz! iltimos qaytadan bazaga kiring !'))
    }
  }

  req.user=user,
  next();
});


//////////////////////////  role  ///////////////////////

const role=(roles)=>{

  return catchError(async(req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return next(new appError('Siz bu userni ochirish huquqiga ega emassiz !',404))
    }
    next()
  })
}

//////////////////// forgot ////////////////////

const forgotpassword=catchError(async(req,res,next)=>{
  // 1 email bormi yoqmi tekshirish

  if(!req.body.email){
    return next(new appError('Email kiritshingiz shart! Email kiriting!',404))
  }
  // 2 emailli odam bor yoqligini tekshirish

  const user=await User.findOne({email:req.body.email})
  if(!user){
    return next(new appError('Bunday emailli user yoq!',404))
  }
  // 3 ResetToken yaratish 

  const token=user.hashTokenMethod()

  console.log(token)
  await user.save({validateBeforeSave:false})



  // 4 emailga jo'natish
  const resentLink=`${req.protocol}://${req.get('host')}/api/v1/users/resentpassword/${token}`
  const subject="Reset password qilish uchun link"
  const html=`<h1>Siz password reset qilish uchun quyidgi tugmani bosing</h1>><a style='color:red' href='${resentLink}'>Reset Password </a>`
  const to='jamshidshamshod0705@gmail.com'

  await mail({subject,html,to})

  res.status(200).json({
    status:'success',
    data:"Right"
  })

  next()
})




////////////////////////
const resentPassword=catchError(async(req,res,next)=>{
  // 1 Token olamiz
  const token=req.params.token
  const hashToken=crypto.createHash('sha256').update(token).digest('hex')
  // 2 Tokenni tekshiramiz -> togri noto'g'riligini vaqti o'tib ketmaganligini
  const user=await User.findOne({
    resetTokenHash:hashToken,
    resetTokenVaqt:{$gt:Date.now()}
  })
  if(!user){
    user.resentPassword=undefined
    user.resetTokenVaqt=undefined
    return next(new appError('Token da xatolik mavjud. Iltimos',404))
  }

  // 3 Yangi parolni saqlaymiz vaqtini saqlaymiz

  if(!req.body.password || !req.body.passwordConfirm){
    return next(new appError("Siz parolni kiritishingiz kk",404))
  }
  if(!(req.body.password===req.body.passwordConfirm)){
    return next(new appError("Parollar teng emas ! Iltimos bir xil parol kiriting",404))
  }

  user.password=req.body.password
  user.passwordConfirm=req.body.passwordConfirm
  user.passwordChangedDate=Date.now()

  user.resetTokenHash=undefined
  user.resetTokenVaqt=undefined

  await user.save()
  // 4 JWT yuboramiz
  const tokenJWT=createToken(user._id)
  saveTokenCookie(tokenJWT,res,req)

  res.status(200).json({
    status:'success',
    token:tokenJWT,
    data:"right"
  })
  next()
})

module.exports={signup,login,protect,role,forgotpassword,resentPassword,createToken}