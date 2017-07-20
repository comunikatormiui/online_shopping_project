var Category = require('../models/category');

exports.category_list = function(req, res, next) {
  Category.find({}, 'name')
  .sort({ name: 'ascending' })
  .exec(function (err, list_categories) {
    if (err) { return next(err); }
    res.render('category_list', { title: 'Categories', category_list: list_categories });
  });
};

exports.category_create_get = function(req, res, next) {
  res.render('category_form', { title: 'Create New Category' });
};

exports.category_create_post = function(req, res, next) {
  req.checkBody('name', 'Category name must be specified').notEmpty();

  req.filter('name').escape();
  req.filter('name').trim();

  var category = new Category({
    name: req.body.name,
  });

  req.getValidationResult().then(function(result) {
    var errors = result.array();
    if (errors.length > 0) {
      res.render('category_form', { title: 'Create New Category', category: category, errors: errors });
    } else {
      category.save(function(err) {
        if (err) { next(err); }
        res.redirect('/categories');
      });
    }
  });
};
