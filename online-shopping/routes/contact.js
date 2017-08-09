var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var mongoSanitize = require('express-mongo-sanitize');




router.get('/',
 function(req, res, next){
   res.render('contact');
 }
);

router.post('/send', function (req, res, next){
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: 'cmpt470user@gmail.com',
    pass: 'cmpt470usr'
    }
});

  mongoSanitize.sanitize(req.body);
  req.checkBody('email', 'Item name must be specified').notEmpty();
  req.checkBody('subject', 'Price must be specified').notEmpty();
  req.checkBody('message', 'Category must be specified').notEmpty();



  req.filter('email').escape();
  req.filter('email').trim();
  req.filter('subject').escape();
  req.filter('subject').trim();
  req.filter('message').escape();
  req.filter('message').trim();
  console.log(req.body.email + "," + req.body.subject + "," + req.body.message)
  var mailOptions = {
   from: 'NOREPLY <user@outlook.com',
   to: req.body.email,
   subject: req.body.subject,
   text: req.body.message
 }


transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
    res.redirect('/');
  } else {
    console.log('Email sent: ' + info.response);
    res.redirect('/');
  }
});
});
module.exports = router;
