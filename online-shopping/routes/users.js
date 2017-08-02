var express = require('express');
var router = express.Router();
var passport = require('../controllers/passport');


/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.send('Ok this now');
});


module.exports = router;
