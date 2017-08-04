//Referencd: http://passportjs.org/docs

var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
var config = require('./config');

module.exports = function(passport, User) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        var fname = req.body.fname;
        var lname = req.body.lname;

        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, false, req.flash('error', 'The email already exists.'));
                }
                else {
                    var newUser  = new User();
                    newUser.local.fname = fname;
                    newUser.local.lname = lname;
                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }

            });

        });

    }));

    passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('error', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                if (!user.validPassword(password))
                    return done(null, false, req.flash('error', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                return done(null, user);
            });
        }
    ));

    // use facebook strategy
    passport.use(new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'middle_name', 'gender', 'link'],
        //profileFields: ['email, displayName']
      },
      function(accessToken, refreshToken, profile, done) { //done = cb
        console.log(accessToken, refreshToken, profile);
        User.findOne({ 'facebook.id': profile.id }, function (err, user) { //whatever you find in fb, it will return in profile
          if (err) { return done(err) }
          if (!user) { //if not find in our db
            var newUser = new User({
              local: {
                email: profile.emails[0].value,
                password: User.generateHash(profile.id),
                fname: profile.name.givenName,
                lname: profile.name.familyName,
                gender: profile.gender,
              }
            });
            // var newUser = new User(); newUser.local.fname = profile.first_name, newUser.local.lname = profile.last_name, newUser.local.email = profile.emails[0].value, newUser.local.password = profile.id,
            newUser.save(function (err){
              if (err) console.log(err);
              return done(err, newUser);}) //bracket for user.save
          }
          else return done(err, newUser); //return everyhing found
          //console.log(err,user);
        }) //bracket for findOne
      } //bracket for function(accessToken....)
    ));

    // use twitter strategy
  passport.use(new TwitterStrategy({
        consumerKey: config.twitter.clientID
      , consumerSecret: config.twitter.clientSecret
      , callbackURL: config.twitter.callbackURL
    },
    function(token, tokenSecret, profile, done) {
      User.findOne({ 'twitter.id': profile.id }, function (err, user) {
        if (err) { return done(err) }
        if (!user) {
          user = new User({
            fname: profile.displayName,
            email: profile.emails[0].value,
          })
          user.save(function (err) {
            if (err) console.log(err)
            return done(err, user)
          })
        }
        else { return done(err, user) }
      })
    }
  ));

  // use github strategy
  passport.use(new GitHubStrategy({
      clientID: config.github.clientID,
      clientSecret: config.github.clientSecret,
      callbackURL: config.github.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ 'github.id': profile.id }, function (err, user) {
        if (!user) {
          user = new User({
            fname: profile.displayName,
            email: profile.emails[0].value,
          })
          user.save(function (err) {
            if (err) console.log(err)
            return done(err, user)
          })
        }
        else { return done(err, user) }
      })
    }
  ));

  // use google strategy
  passport.use(new GoogleStrategy({
      consumerKey: config.google.clientID,
      consumerSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ 'google.id': profile.id }, function (err, user) {
        if (!user) {
          user = new User({
            fname: profile.displayName,
            email: profile.emails[0].value,
          })
          user.save(function (err) {
            if (err) console.log(err)
            return done(err, user)
          })
        }
        else { return done(err, user) }
      })
    }
  ));
};
