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


//request login and render login message
	router.get('/login', function(req, res){
		res.render('login', {message: req.flash('loginMessage')});
	});

//request signup and render signup
	router.get('/signup',
		function(req, res){
			res.render('signup', {message: req.flash('signupMessage')});
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
				user : req.user
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
	        	'local.cell_phone': req.body.cell_phone,
	        	'local.gender': req.body.gender,
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

//autheticate login, redirect to root else redirect to login
    router.post('/login', passport.authenticate('local-login', {
    	successRedirect : '/',
        //successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));

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


	router.get('/history', function(req, res, next) {
	  res.render('history');
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
