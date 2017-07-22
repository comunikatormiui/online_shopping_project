var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/categoryController');

router.get('/create', category_controller.category_create_get);
router.post('/create', category_controller.category_create_post);
router.get('/:id/update', category_controller.category_update_get);
router.post('/:id/update', category_controller.category_update_post);
router.get('/:id', category_controller.category_detail);
router.get('/', category_controller.category_list);

module.exports = router;
