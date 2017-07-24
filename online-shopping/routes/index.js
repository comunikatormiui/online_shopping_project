var login_routing = require('./login_routing');

router_export = function(router, passport, User){
	router.get('/', function(req, res, next) {
		console.log('get /');
	  res.render('index', { title: 'Express' });
	});

	router.get('/login', function(req, res){
		res.render('login', {message: req.flash('loginMessage')});
	});

	router.get('/signup',
		function(req, res){
			res.render('signup', {message: req.flash('signupMessage')});
		}
	);

	router.get('/profile', login_routing.isLoggedIn,
		function(req, res){
			res.render('profile', {
				user : req.user
			});
		}
	);

	router.post('/profile', login_routing.isLoggedIn, function(req, res) {
	    User.update(
	    	{'local.email': req.user.local.email},
	    	{
	        	'local.fname': req.body.fname,
	        	'local.lname': req.body.lname ,
	        	'local.date_of_birth': req.body.date_of_birth,
	        	'local.address': req.body.address,
	        	'local.cell_phone': req.body.cell_phone
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

	router.post('/signup',
		passport.authenticate('local-signup', {
			successRedirect : '/',
			//successRedirect : '/profile',
			failureRedirect : '/signup',
			failureFlash : true
		})
	);

    router.post('/login', passport.authenticate('local-login', {
    	successRedirect : '/',
        //successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));

	router.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
};

module.exports = router_export;
