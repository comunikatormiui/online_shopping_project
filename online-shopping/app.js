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
var paginate = require('express-paginate');
var image = require('./routes/imagefile');
//var io = require("socket.io");
//var socket = io.listen(1234, "0.0.0.0");
var usrs = {};
/*
socket.on("connection", function (client) {
    client.on("join", function(name){
        usrs[client.id] = name;
        client.emit("update", "You have connected to the server.");
        socket.sockets.emit("update", name + " has joined the server.")
        socket.sockets.emit("update-usrs", usrs);
    });

    client.on("send", function(msg){
        socket.sockets.emit("chat", usrs[client.id], msg);
    });

    client.on("disconnect", function(){
        socket.sockets.emit("update", usrs[client.id] + " has left the server.");
        delete usrs[client.id];
        socket.sockets.emit("update-usrs", usrs);
    });
});
*/


require('./controllers/passport')(passport, User);

var index = require('./routes/index');
var users = require('./routes/users');
var items = require('./routes/items');
var categories = require('./routes/categories');
var wishlist = require('./routes/wishlist');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(paginate.middleware(10, 10));
app.use(expressValidator());

//authentication
app.use(session({ secret: 'online-shopping_secret_key' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(function(req, res, next) {
	res.locals.login = req.isAuthenticated();
	res.locals.success_messages = req.flash('success');
	res.locals.warning_messages = req.flash('warning');
	res.locals.error_messages = req.flash('error');
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
  image.getImages(function(err, cb) {
    if (err) {throw err;}
    res.json(cb);
  });
});

// URL : http://localhost:3000/images/(give you collectionID); To get the single image/File using id from the MongoDB
app.get('/images/:id', function(req, res) {
  image.getImageById(req.params.id, function(err, cb) {
    if (err) {throw err;}
    res.send(cb.path)
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
