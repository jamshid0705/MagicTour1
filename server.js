const dotenv = require('dotenv'); // globalni o'zgaruvchilarga saqlash
dotenv.config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');
const tourRouter = require('./router/tourRouter');
const mail = require('./utility/mai');



// Exception error async

process.on('uncaughtException',err=>{
  console.log("Error name: ",err.name, "Error message: ",err.message)
  process.exit(0)
})
// const a='jamshid'
// console.log(a[2])
const dbTour = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(dbTour, {})
  .then(() => {
    console.log('Databasega ulandi');
  })

app.listen(+process.env.PORT, process.env.URL, () => {
  console.log('ulandingiz');
});

// Rejection error async

process.on('unhandledRejection',(err)=>{
  console.log("Error name: ",err.name, "Error message: ",err.message)
})
