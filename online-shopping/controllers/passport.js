//Referencd: http://passportjs.org/docs
var mongoSanitize = require('express-mongo-sanitize');
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
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

        req.checkBody('fname', 'User first name must be specified').notEmpty();
        req.checkBody('lname', 'User last name must be specified').notEmpty();
        req.checkBody('email', 'User email must be specified').notEmpty();
        req.checkBody('password', 'User password must be specified').notEmpty();

        req.filter('email').escape();
        req.filter('email').trim();
        req.filter('password').escape();
        req.filter('password').trim();
        req.filter('fname').escape();
        req.filter('fname').trim();
        req.filter('lname').escape();
        req.filter('lname').trim();

        mongoSanitize.sanitize(req.body);
        var fname = req.body.fname;
        var lname = req.body.lname;
        email = email;
        password = password;

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

            email = mongoSanitize.sanitize(email);
            password = mongoSanitize.sanitize(password);

            req.checkBody('email', 'User email must be specified').notEmpty();
            req.checkBody('password', 'User password must be specified').notEmpty();

            req.filter('email').escape();
            req.filter('email').trim();
            req.filter('password').escape();
            req.filter('password').trim();

            console.log(email);
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
      },
      function(accessToken, refreshToken, profile, done) { //done = cb
        console.log(profile);//console.log(accessToken, refreshToken, profile);
        User.findOne({ 'facebook.id': profile.id }, function (err, user) { //whatever you find in fb, it will return in profile
          if (err) { return done(err) }
          if (!user) { //if not find in our db
            if (profile.gender == 'female')
              var gendertemp='Female';
            if (profile.gender == 'male')
              var gendertemp='Male';
            var newUser = new User({
              local: {
                email: profile.emails[0].value,
                password: User.generateHash(profile.id),
                fname: profile.name.givenName,
                lname: profile.name.familyName,
                gender: gendertemp,
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

    // use github strategy
    passport.use(new GitHubStrategy({
        clientID: config.github.clientID,
        clientSecret: config.github.clientSecret,
        callbackURL: config.github.callbackURL,
        //passReqToCallback: true
      },
      function(accessToken, refreshToken, profile, done) {
        //console.log(profile);
        User.findOne({ 'github.id': profile.id }, function (err, user) {
          if (err) { return done(err) }
          if (!user) {
            var newUser = new User({
              local: {
                email:profile.emails[0].value,
                password: User.generateHash(profile.id),
                fname: profile.displayName,
                lname: profile.displayName,
              }
            });//console.log("------------------------------");console.log(newUser.local.email, newUser.local.password, newUser.local.fname, newUser.local.lname);
            newUser.save(function (err) {
              if (err) console.log(err);
              return done(err, newUser);})
          }
          else return done(err, newUser);
        })
      }
    ));
};
