var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');



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

  var mailOptions = {
   from: 'User1 <user@outlook.com',
   to: 'cmpt470user@gmail.com',
   subject: 'Item Inquiry',
   text: 'I want to buy your product please'
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
