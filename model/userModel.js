const mongoose = require('mongoose');
const validator=require('validator')
const bcrypt=require('bcrypt');
const crypto=require('crypto');


const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,'Siz name kiritishungiz kerak'],
    trim:true
  },
  email:{
    type:String,
    required:[true,'Siz name kiritishungiz kerak'],
    unique:[true,'Bunday email mavjud'],  // emailni bor yo'qligini tekshiradi
    lowercase:true,

    validate:[validator.isEmail,'togri email kiriting']
    },
    photo:
      {type:String},
    password:{
        type:String,
        required:[true,'Siz password kiritishungiz kerak'],
        minlength:8,
        validate:{validator:function(val){
          return validator.isStrongPassword(val)
        },message:'Siz kuchliroq parol kiritishingiz kk'},
        select:false // passwordni qaytarmaydi get qilganimizda
    },
    role:{
      type:String,
      enum:['user','guide','lead-guide','admin'],
      default:'user',
      required:[true,'siz role']
    },
    passwordConfirm:{
      type:String,
      required:[true,'Siz password kiritishungiz kerak'],
      validate:{validator:function(val){
        return val===this.password
      },message:'Bir xil parol kiriting'},
      minlength:8 
    },
    passwordChangedDate:{
      type:Date,
      default:null
    },
    resetTokenHash:String,
    resetTokenVaqt:Date
});


// Document middleware

userSchema.pre('save',async function(next){
  if(!this.isModified('password')){
     return next()
  }
  const hashPassword=await bcrypt.hash(this.password,12)
  this.password=hashPassword;
  this.passwordConfirm=undefined;

  next()
})

////////////////////// resetTokenni yaratish /////////////

userSchema.methods.hashTokenMethod=function(){
  const token=crypto.randomBytes(32).toString('hex')

  const tokenHash=crypto.createHash('sha256').update(token).digest('hex')

  this.resetTokenHash=tokenHash
  this.resetTokenVaqt=Date.now()+10*60*1000

  return token
}

console.log('usermodel')


const User = mongoose.model('users', userSchema);

module.exports = User;
