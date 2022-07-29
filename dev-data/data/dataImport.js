const mongoose = require('mongoose');
const fs = require('fs');
const tourModel = require('./../../model/tourModel');
const userModel=require('./../../model/userModel')
const reviewModel=require('./../../model/reviews')
const dotenv = require('dotenv');

dotenv.config({path: './config.env',});

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {})
  .then(() => {
    console.log('DB connected');
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
  });

const tour = JSON.parse(
  fs.readFileSync('./dev-data/data/tours.json', 'utf-8')
);
const user=JSON.parse(fs.readFileSync('./dev-data/data/users.json','utf-8'))
const  review=JSON.parse(fs.readFileSync('./dev-data/data/reviews.json','utf-8'))
// console.log(user)

// databasega malumotlarni polniy qoshadi
const addData = async () => {
 
    await tourModel.create(tour);
    await userModel.create(user);
    await reviewModel.create(review);
    // await userModel.create(user)
    console.log('Norm saqlandi');
  
};

// databasedan malumotlarni polniy uchiradi
const deleteData = async () => {
  
    await tourModel.deleteMany();
    await userModel.deleteMany();
    await reviewModel.deleteMany()
    // await userModel.deleteMany()
    console.log('Top-toza boldi');
    process.exit()
 
};

if(process.argv[2]==='--add'){
  addData()
}
if(process.argv[2]==='--delete'){
  deleteData()
}

