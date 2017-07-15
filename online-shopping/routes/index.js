// var express = require('express');
// var router = express.Router();

router = function(router, passport){
	router.get('/', function(req, res, next) {
	  res.render('index', { title: 'Express' });
	});

	router.get('/login', function(req, res){
		res.render('login', {message: req.flash('loginMessage')});
	});

	router.get('/signup', function(req, res){
		res.render('signup', {message: req.flash('signupMessage')});
	});

	router.get('/profile', isLoggedIn, function(req, res){
		res.render('profile', {
			user : req.user
		});
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;
