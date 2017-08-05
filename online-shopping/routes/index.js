var login_routing = require('./login_routing');
var Item = require('../models/item');
var Category = require('../models/category');
var User = require('../models/user');
var Transaction = require('../models/transaction');
var category_controller = require('../controllers/categoryController');

router_export = function(router, passport, User){

//request root directory and render Express Main Page
	/*router.get('/', function(req, res, next) {
		console.log('get /');
	  res.render('index', { title: 'Our Shopping Page' });
	});*/
	router.get('/', category_controller.catListForHome);
	router.get("/auth/facebook", passport.authenticate("facebook",{ scope : ['public_profile', 'email']}));
	// router.get("/auth/facebook/callback",passport.authenticate("facebook",{ failureRedirect: '/login'}, function(err,user,info){console.log(err,user,info);}),function(req,res){res.redirect("/");});
	router.get("/auth/facebook/callback", function(req, res, next) {
		passport.authenticate("facebook", function(err, user, info) {
			if (err) return next(err);
			if (!user) return res.redirect('/login'); // if authentication failed, redirect to login
			req.logIn(user, function(err) { // if success, log user in
				if (err) return next(err);
				res.redirect('/');
			});
		}) (req, res, next);
	})
	//app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), res.render('login'));
	//app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), res.redirect('/login'));

	router.get("/auth/github", passport.authenticate("github", { scope : 'email'}));
	router.get("/auth/github/callback", function(req, res, next) {
		passport.authenticate("github", function(err, user, info) {
			if (err) return next(err);
			if (!user) return res.redirect('/login'); // if authentication failed, redirect to login
			req.logIn(user, function(err) { // if success, log user in
				if (err) return next(err);
				res.redirect('/');
			});
		}) (req, res, next);
	})

//request login and render login message
	router.get('/login', function(req, res){
		res.render('login', { title: 'Log In' });
	});

//request signup and render signup
	router.get('/signup',
		function(req, res){
			res.render('signup', { title: 'Sign Up' });
		}
	);

	router.get('/about',
		function(req, res){
			res.render('about')
		}
	);

    router.get('/chat',
		function(req, res){
			res.render('chat')
		}
	);

//request wishlist, check if logged in and render user information
	/*router.get('/wishlist', isLoggedIn, function(req, res) {
		res.render('wishlist', {
			user : req.user
		});
	}
); */

//request profile, check if logged in and render user information
	router.get('/profile', login_routing.isLoggedIn,
		function(req, res){
			res.render('profile', {
				user : req.user,
				title : 'Profile'
			});
		}
	);

	//request profile, check if logged in and update user forms, redirect to /profile
	router.post('/profile', login_routing.isLoggedIn, function(req, res) {
	    User.update(
	    	{'local.email': req.user.local.email},
	    	{
	        	'local.fname': req.body.fname,
	        	'local.lname': req.body.lname ,
	        	'local.date_of_birth': req.body.date_of_birth,
	        	'local.address': req.body.address,
						'local.gender': req.body.gender,
	        	'local.cell_phone': req.body.cell_phone,
	    	},
	    	function(err, numberAffected, rawResponse) {
	    		if(err){
	    			console.log(err.WriteResult.writeConcernError);
	    		}
	    		console.log(numberAffected);
	    	}
	    );
	    res.redirect('/profile');
	});

//authenticate signup, if sucess then redirect to root, else redirect to signup
	router.post('/signup',
		passport.authenticate('local-signup', {
			successRedirect : '/',
			//successRedirect : '/profile',
			failureRedirect : '/signup',
			failureFlash : true
		})
	);

		// authenticate login
		router.post('/login', function(req, res, next) {
			passport.authenticate('local-login', function(err, user, info) {
				if (err) { return next(err); }
				// if authentication failed, redirect to login
				if (!user) { return res.redirect('/login'); }
				// if success, log user in
				req.logIn(user, function(err) {
					if (err) { return next(err); }
					// if forwarding url is avaiable, redirect to that, otherwise, redirect to homepage
					if (req.session.forwarding_url) {
						res.redirect(req.session.forwarding_url);
						req.session.forwarding_url = undefined;
					} else {
						res.redirect('/');
					}
				});
			}) (req, res, next);
		})

	router.get('/transactions', login_routing.isLoggedIn,
		function(req, res) {
			User.findOne({'local.email': req.user.local.email},
				function(err, user){
					Transaction.find({'buyer': user._id})
					.populate('item')
					.exec(function(err, transactions) {
					if (err) {
						console.log('err');
						return next(err);
					}
					console.log(transactions);
					res.render('transaction_list', { title: 'List of Past Transactions', transaction_list: transactions});
				});
			});
		});

	//logout, log user out and redirect to root
	router.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});




};

//check if user is authenticated else redirect to home page
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router_export;
