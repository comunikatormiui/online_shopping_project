var express = require('express');
var router = express.Router();
var item_controller = require('../controllers/itemController');

var login_routing = require('./login_routing');

router.get('/:id/add', item_controller.wishlist_add);
router.get('/:id/delete', item_controller.wishlist_delete);
router.get('/:id', item_controller.item_detail);
router.get('/', login_routing.isLoggedIn, item_controller.wishlist);


module.exports = router;
