const lang = require("../model/langModel");
const catchError = require("../utility/catchError");

const {getAll,getOne,add,update,deleteData}=require('../controller/handlerController')


const getAllWord=(req,res,next)=>{
  getAll(req,res,next,lang)
}

const getOneLang=(req,res,next)=>{
  getOne(req,res,next,lang)
}

const addLang=(req,res,next)=>{
  add(req,res,next,lang)
}

const updateLang=(req,res,next)=>{
  update(req,res,next,lang)
}

const deleteLang=(req,res,next)=>{
  deleteData(req,res,next,lang)
}

module.exports={getAllWord,getOneLang,addLang,updateLang,deleteLang}