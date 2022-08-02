const mongoose=require('mongoose')

const langSchema=new mongoose.Schema({
  source:{
    type:String,
    required:[true,'Siz source ni kiritng!']
  },
  uz:{
    type:String,
    required:[true,'Siz uzbekcha kiritng!']
  },
  eng:{
    type:String,
    required:[true,'Siz englishcha kiritng!']
  },
  rus:{
    type:String,
    required:[true,'Siz ruscha kiritng!']
  },
  createAt:{
    type:Date,
    default:Date.now()
  }
})

langSchema.pre('save',function(next){
  this.source=`source_${this.source}`
  next()
})
console.log('11111111111111111111')
const lang=mongoose.model('langs',langSchema)
module.exports=lang