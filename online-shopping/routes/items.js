var express = require('express');
var router = express.Router();
var multer = require('multer');
var Item = require('../models/item');

var item_controller = require('../controllers/itemController');


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

router.get('/create', item_controller.item_create_get);
router.post('/create', upload.any(), item_controller.item_create_post);
router.get('/search', item_controller.item_search);
router.get('/:id/update', item_controller.item_update_get);
router.post('/:id/update',upload.any(), item_controller.item_update_post);
router.post('/:id/delete', item_controller.item_delete);
router.get('/:id', item_controller.item_detail);
router.get('/', item_controller.item_list);



module.exports = router;
