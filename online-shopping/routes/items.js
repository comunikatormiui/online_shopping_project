var express = require('express');
var router = express.Router();
var multer = require('multer');
var Item = require('../models/item');

var item_controller = require('../controllers/itemController');
var login_routing = require('./login_routing');


var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/')  //upload file to this folder
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
    //cb(null, file.originalname + '-' + Date.now())
  }
});

var upload = multer({
  storage: storage
});

router.get('/create', login_routing.isLoggedIn,item_controller.item_create_get);
router.post('/create', login_routing.isLoggedIn, upload.any(), item_controller.item_create_post);
router.get('/search', item_controller.item_search);
router.get('/:id/update', login_routing.isLoggedIn, item_controller.item_update_get);
router.post('/:id/update', upload.any(), item_controller.item_update_post);
router.post('/:id/delete', login_routing.isLoggedIn, item_controller.item_delete);
router.get('/:id', item_controller.item_detail);
router.get('/', item_controller.item_list);
router.get('/:id/buy', login_routing.isLoggedIn, item_controller.item_buy_get);
router.post('/:id/buy', login_routing.isLoggedIn, item_controller.item_buy_post);
router.post('/:id/review', login_routing.isLoggedIn, item_controller.item_review_post);



module.exports = router;
