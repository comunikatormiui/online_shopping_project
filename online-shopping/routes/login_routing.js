var express = require('express');
var router = express.Router();

exports.isLoggedIn = function(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // shows flash message
    req.flash('warning', 'You must log in to see this page.');
    // stores the URL trying to be accessed.
    if (req.method == 'GET') {
      req.session.forwarding_url = req.originalUrl;
    }
    // redirect user to login page
    res.redirect('/login');
}
