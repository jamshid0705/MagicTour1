const passport=require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const jwt = require('jsonwebtoken');

/// create token
const createToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/////////// cookie /////////////
const saveTokenCookie = (token, res, req) => {
  res.cookie('jwt', token, {
    maxAge: process.env.JWT_EXPIRES_DATA * 24 * 60 * 60 * 1000, // nechi kun berish vaqti token
    httpOnly: true,
    secure: req.protocol === 'https' ? true : false,
  });
};


passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_CLIENT_URL,
    passReqToCallback:true
  },function(request,accessToken,refreshToken,profile,done){
    // console.log(accessToken)
    // console.log(refreshToken)
    // console.log(profile.id)
   
    const a=(req,res)=>{
       const token = createToken(profile.id);
       saveTokenCookie(token, res, req);
    }
    a(req,res)
    return done(null,profile)
  }
))

