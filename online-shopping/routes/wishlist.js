var express = require('express');
var router = express.Router();
var item_controller = require('../controllers/itemController');
var login_routing = require('./login_routing');


router.post('/:id/delete', item_controller.item_delete);
router.get('/:id', item_controller.item_detail);
//router.get('/', item_controller.wishlist);
router.get('/:id/wishlist', login_routing.isLoggedIn, item_controller.item_put_wishlist);
router.post('/:id/wishlist', login_routing.isLoggedIn, item_controller.item_put_wishlist);

module.exports = router;
