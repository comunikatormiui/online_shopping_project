var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/categoryController');

router.get('/:id', category_controller.category_detail);
router.get('/', category_controller.category_list);

module.exports = router;
