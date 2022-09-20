const passport=require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy;


passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});


passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_CLIENT_URL,
    passReqToCallback:true
  },function(request,accessToken,refreshToken,profile,done){
    // console.log(accessToken)
    // console.log(refreshToken)
    // console.log(profile.id)
    console.log(profile.id)
    return done(null,profile)
  }
))

