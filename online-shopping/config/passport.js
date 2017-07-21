
var LocalStrategy   = require('passport-local').Strategy;

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
//Added
        var date_of_birth = req.body.date_of_birth;
        var address = req.body.address;
        var cell_phone = req.body.cell_phone;

        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } 
                else {
                    var newUser  = new User();
                    newUser.local.fname = fname;
                    newUser.local.lname = lname;
                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password);
//Add               
                 //   if (date_of_birth != null && !date_of_birth.isEmpty()) {
                        newUser.local.date_of_birth = date_of_birth;
                 //   }
                 //   if (cell_phone != null && !cell_phone.isEmpty()){
                        newUser.local.cell_phone = cell_phone;
                 //   }
                 //   if (address != null && !address.isEmpty()){
                        newUser.local.address = address;
                 //   }
                    
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
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                return done(null, user);
            });

        }
    ));
};
