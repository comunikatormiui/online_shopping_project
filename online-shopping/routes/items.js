var express = require('express');
var router = express.Router();

var item_controller = require('../controllers/itemController');

router.get('/create', item_controller.item_create_get);
router.post('/create', item_controller.item_create_post);
router.get('/search', item_controller.item_search);
router.get('/:id/update', item_controller.item_update_get);
router.post('/:id/update', item_controller.item_update_post);
router.post('/:id/delete', item_controller.item_delete);
router.get('/:id', item_controller.item_detail);
router.get('/', item_controller.item_list);

module.exports = router;
