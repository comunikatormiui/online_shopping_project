var express = require('express');
var router = express.Router();
var item_controller = require('../controllers/itemController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Ok this now');
});

router.get('/:id', item_controller.item_detail);
router.get('/', item_controller.item_list);



module.exports = router;
