
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
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
        //-clientID: FACEBOOK_APP_ID,
        //-clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: config.facebook.callbackURL
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOne({ 'facebook.id': profile.id }, function (err, user) {
          if (err) { return done(err) }
          if (!user) {
            user = new User({
              fname: profile.displayName,
              email: profile.emails[0].value,
            })
            user.save(function (err) {
              if (err) console.log(err);
              return done(err, user);
            })
          }
          else { return done(err, user); }
        })
      }
  ));
};
