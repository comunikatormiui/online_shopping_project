var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var passport = require('passport');
var flash = require('connect-flash');
var session  = require('express-session');
var multer = require("multer");
var User = require('./models/user'); //---------------------

require('./controllers/passport')(passport, User);

var index = require('./routes/index');
var users = require('./routes/users');
var items = require('./routes/items');
var categories = require('./routes/categories');
var wishlist = require('./routes/wishlist');
var image = require('./routes/imagefile');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//authentication
app.use(session({ secret: 'online-shopping_secret_key' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(function(req, res, next) {
	res.locals.login = req.isAuthenticated();
	next();
});

//app.use('/', index);
require('./routes/index')(app, passport, User);
app.use('/users', users);
app.use('/items', items);
app.use('/categories', categories);
app.use('/wishlist', wishlist);
app.use('/imagefile', image);


app.get('/images', function(req, res) {
  routes.getImages(function(err, genres) {
    if (err) {throw err;}
    res.json(genres);
  });
});
 
// URL : http://localhost:3000/images/(give you collectionID)
// To get the single image/File using id from the MongoDB
app.get('/images/:id', function(req, res) {
  //calling the function from index.js class using routes object..
  routes.getImageById(req.params.id, function(err, genres) {
    if (err) {throw err;}
    //res.download(genres.path);
    res.send(genres.path)
  });
});
 



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/online-shopping';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = app;
