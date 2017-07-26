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

	router.get('/wishlist', isLoggedIn, function(req, res) {
		res.render('wishlist', {
			user : req.user
		});
	}
);

	router.get('/profile', isLoggedIn,
		function(req, res){
			res.render('profile', {
				user : req.user
			});
		}
	);



	router.post('/profile', isLoggedIn, function(req, res) {
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

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router_export;
