var express = require('express');
var router = express.Router();
var item_controller = require('../controllers/itemController');


router.post('/:id/delete', item_controller.item_delete);
router.get('/:id', item_controller.item_detail);
router.get('/', item_controller.wishlist);


module.exports = router;
