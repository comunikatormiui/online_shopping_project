var Item = require('../models/item');
var Category = require('../models/category');

var async = require('async');

exports.item_list = function(req, res, next) {
  Item.find({}, 'name seller category price')
  .populate('category')
  .exec(function (err, list_items) {
    if (err) { return next(err); }
    res.render('item_list', { title: 'Item Directory', item_list: list_items });
  });
};

exports.item_search = function(req, res, next) {
  req.sanitizeQuery('keyword').escape();
  req.sanitizeQuery('keyword').trim();
  var keyword = req.query.keyword;

  Item.find({ 'name' : { $regex: keyword, $options: 'i' }})
  .exec(function (err, list_items) {
    if (err) { return next(err); }
    res.render('item_list', { title: 'Search results for "'+keyword+'"', item_list: list_items, keyword: keyword });
  });
}

exports.item_detail = function(req, res, next) {
  req.filter('id').escape();
  req.filter('id').trim();

  Item.findById(req.params.id)
  .populate('category')
  .exec(function (err, item) {
    if (err) { return next(err); }
    res.render('item_detail', { title: item.name, item: item });
  });
}

exports.item_create_get = function(req, res, next) {
  Category.find({}, 'name')
  .sort({ name: 'ascending' })
  .exec(function(err, categories) {
    if (err) { next(err); }
    res.render('item_form', { title: 'New item', category_list: categories });
  });
};

exports.item_create_post = function(req, res, next) {
  req.checkBody('name', 'Item name must be specified').notEmpty();
  req.checkBody('price', 'Price must be specified').notEmpty();
  req.checkBody('price', 'Price: only floating-point number is allowed').isFloat();
  req.checkBody('category', 'Category must be specified').notEmpty();
  req.checkBody('seller', 'Seller must be specified').notEmpty();

  req.filter('name').escape();
  req.filter('name').trim();
  req.filter('price').escape();
  req.filter('price').trim();
  req.filter('category').escape();
  req.filter('category').trim();
  req.filter('description').escape();
  req.filter('description').trim();
  req.filter('seller').escape();
  req.filter('seller').trim();

  var item = new Item({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    description: req.body.description,
    seller: req.body.seller
  });

  req.getValidationResult().then(function(result) {
    var errors = result.array();
    if (errors.length > 0) {
      Category.find({}, 'name')
      .exec(function(err, categories) {
        if (err) { return next(err); }
        res.render('item_form', { title: 'Create New Item', item: item, category_list: categories, selected_category: item.category, errors: errors })
      });
    } else {
      item.save(function(err) {
        if (err) { next(err); }
        res.redirect(item.url);
      });
    }
  });
};

exports.item_update_get = function(req, res, next) {
  req.filter('id').escape();
  req.filter('id').trim();

  async.parallel({
    item: function(callback) {
      Item.findById(req.params.id).exec(callback);
    },
    category: function(callback) {
      Category.find({}, 'name').sort({ name: 'ascending'}).exec(callback);
    }
  }, function(err, results) {
    if (err) { next(err); }
    res.render('item_form', { title: 'Update Item', category_list: results.category, item: results.item, selected_category: results.item.category });
  });
}

exports.item_update_post = function(req, res, next) {
  req.filter('id').escape();
  req.filter('id').trim();

  req.checkBody('name', 'Item name must be specified').notEmpty();
  req.checkBody('price', 'Price must be specified').notEmpty();
  req.checkBody('price', 'Price: only floating-point number is allowed').isFloat();
  req.checkBody('category', 'Category must be specified').notEmpty();
  req.checkBody('seller', 'Seller must be specified').notEmpty();

  req.filter('name').escape();
  req.filter('name').trim();
  req.filter('price').escape();
  req.filter('price').trim();
  req.filter('category').escape();
  req.filter('category').trim();
  req.filter('description').escape();
  req.filter('description').trim();
  req.filter('seller').escape();
  req.filter('seller').trim();

  var item = new Item({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    description: req.body.description,
    seller: req.body.seller,
    _id: req.params.id
  });

  req.getValidationResult().then(function(result) {
    var errors = result.array();
    if (errors.length > 0) {
      Category.find({}, 'name')
      .exec(function(err, categories) {
        if (err) { return next(err); }
        res.render('item_form', { title: 'Update New Item', item: item, category_list: categories, selected_category: item.category, errors: errors })
      });
    } else {
      Item.findByIdAndUpdate(req.params.id, item, {}, function(err, theitem) {
        if (err) { return next(err); }
        res.redirect(theitem.url);
      });
    }
  });
}

exports.item_delete = function(req, res, next) {
  req.filter('id').escape();
  req.filter('id').trim();
  Item.findByIdAndRemove(req.body.itemid, function deleteItem(err) {
    if (err) { return next(err); }
    res.redirect('/items');
  })
}
