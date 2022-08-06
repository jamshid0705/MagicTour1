const fs = require('fs');
const User = require('../model/userModel');
const catchError = require('../utility/catchError2');
const bcrypt = require('bcrypt');
const multer = require('multer');
const sharp = require('sharp');
const { saveTokenCookie } = require('./authController');
const CreateToken = require('../controller/authController');
const {
  getAll,
  getOne,
  add,
  update,
  deleteData,
} = require('../controller/handlerController');
const appError = require('../utility/appError');

////////// multer //////////////

// const multerStorage=multer.diskStorage({
//   destination:(req,file,cb)=>{
//    cb(null,'public/img/users')
//   },
//   filename:(req,file,cb)=>{
//     const ext=file.mimetype.split('/')[1]
//     const filename=`user-${req.user._id}-${Date.now()}.${ext}`

//     cb(null,filename)
//   }
// })

const multerStorage = multer.memoryStorage(); // bufer tezkor hotiraga saqlaydi

const filterImage = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new appError('Siz rasm yuklang !', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: filterImage,
});

const uploadPhoto = upload.single('photo');

///////// ressize image ///////////
const resizeImage = catchError(async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const ext = req.file.mimetype.split('/')[1];
  req.file.filename = `user-${req.user.id}-${Date.now()}.${ext}`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .toFile(`${__dirname}/../public/img/users/${req.file.filename}`);
  next();
});

// console.log(typeof fs.readFileSync('./dev-data/data/tours-simple.json',"utf-8"))
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`, 'utf-8')
);

/// get
// const getAllUsers = (req, res) => {
//   res.status(200).json({
//     // faylni json formatda qaytaradi
//     status: 'success',
//     results: users.length,
//     data: users,
//   });
// };
// // get id
// const getIdUsers = (req, res) => {
//   const id = req.params.id;
//   const data = users.find((val) => val.id == id);
//   if (data) {
//     res.status(200).json({
//       // faylni json formatda qaytaradi
//       status: 'success',
//       data: data,
//     });
//   }
// };

// // post

// const addUsers = (req, res) => {
//   const data = req.body;
//   const id = users[users.length - 1].id + 1;
//   const newUsers = Object.assign({ id: id }, data);
//   users.push(newUsers);

//   fs.writeFile(
//     `${__dirname}/../dev-data/data/tours-simple.json`,
//     JSON.stringify(users),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: newUsers,
//       });
//     }
//   );
// };

// // patch
// const updateUsers = (req, res) => {
//   const id = req.params.id;
//   if (id > users.length) {
//     return res.status(201).json({
//       status: 'success',
//       message: 'topilmadi',
//     });
//   }
// };

// //delete
// const deleteUsers = (req, res) => {
//   const id = req.params.id;
//   if (id > users.length) {
//     return res.status(201).json({
//       status: 'success',
//       message: 'topilmadi',
//     });
//   }
// };

const getAllUsers = (req, res, next) => {
  getAll(req, res, next, User);
};
// get id
const getIdUsers = (req, res, next) => {
  getOne(req, res, next, User);
};
// post
const addUsers = (req, res, next) => {
  add(req, res, next, User);
};
// patch
const updateUsers = (req, res, next) => {
  update(req, res, next, User);
};
//delete
const deleteUsers = (req, res, next) => {
  deleteData(req, res, next, User);
};

// app.get('/api/v1/tours',getAllTour)
// app.get("/api/v1/tours/:id",getIdTour)
// app.patch('/api/v1/tours/:id',updateTour)
// app.delete('/api/v1/tours/:id',deleteTour)
// app.post("/api/v1/tours",addTour)

////////////////////////// update password ///////////////////////

const updateMePassword = catchError(async (req, res, next) => {
  // 1) eski passwordni tekshirib ko'ramiz

  if (req.body.oldpassword === req.body.newpassword) {
    return next(new appError('Siz bir xil parol kiritdingiz ! ', 401));
  }

  if (!req.body.oldpassword) {
    return next(new appError('Siz eski parolni kirtishingiz shart ! ', 401));
  }

  const user = await User.findById(req.user.id).select('+password'); // select chaqirilgan elementni olib keladi

  // console.log(user)
  const tekshir = await bcrypt.compare(req.body.oldpassword, user.password);

  // console.log(tekshir)
  if (!tekshir) {
    return next(new appError('Notogri parol kiritidng ! ', 401));
  }

  // if(req.body.oldpassword)

  if (req.body.newpassword != req.body.newpasswordConfirm) {
    return next(new appError('Siz bir xil parol kiriting ! ', 401));
  }

  // 2) yangi parolni saqlaymiz

  user.password = req.body.newpassword;
  user.passwordChangedDate = Date.now();

  await user.save({ validateBeforeSave: false });

  // 3 yangi JWT berish

  const token = CreateToken.createToken(user._id);
  saveTokenCookie(token, res, req);
  res.status(200).json({
    token: token,
  });

  next();
});

///////////////// update me malumotlar ////////////

const updateMe = catchError(async (req, res, next) => {
  // 1 malumotlarni yangilash
  console.log(req.file);
  const user = await User.findById(req.user.id);

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.photo = req.file.filename || user.photo;

  const newuser = await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: newuser,
  });

  next();
});

module.exports = {
  getAllUsers,
  getIdUsers,
  updateUsers,
  deleteUsers,
  addUsers,
  updateMePassword,
  updateMe,
  uploadPhoto,
  resizeImage,
};
