var Item = require('../models/item');
var Category = require('../models/category');
var paginate = require('express-paginate');
var multer = require('multer');


var async = require('async');



exports.item_list = function(req, res, next) {
  req.sanitizeQuery('sort').escape();
  req.sanitizeQuery('sort').trim();

  // Sort items according to given value of sort parameter
  // Default is alphabetical
  var sort = { name: 'asc' };
  if (req.query.sort=='price-asc') { sort = { price: 'asc' } }
  else if (req.query.sort=='price-desc') { sort = { price: 'desc' } }
  else if (req.query.sort=='popular') { sort = { view_count: 'desc' } }


  // Check if a page number is given
  // If not, default is 1
  var page = req.query.page ? req.query.page : 1;
  // Limit of items per page
  var limit = 5;

  // Create an object to pass into paginate method
  var options = {
    page: page,
    limit: limit,
    sort: sort
  };

  // Get items and render the view
  Item.paginate({}, options)
  .then(function(items) {
    res.render('item_list', {
      title: 'Item Directory',
      item_list: items.docs,
      pageCount: items.pages,
      itemCount: items.total,
      pages: paginate.getArrayPages(req)(3, items.pages, page),
      page: page,
      limit: items.limit,
      sortBy: req.query.sort
    });
  });
};

exports.item_search = function(req, res, next) {
  req.sanitizeQuery('sort').escape();
  req.sanitizeQuery('sort').trim();
  req.sanitizeQuery('keyword').escape();
  req.sanitizeQuery('keyword').trim();
  var keyword = req.query.keyword;

  // Default is relevant
  var sort;
  if (req.query.sort=='price-asc') { sort = { price: 'asc' } }
  else if (req.query.sort=='price-desc') { sort = { price: 'desc' } }
  else if (req.query.sort=='popular') { sort = { view_count: 'desc' } }

  var page = req.query.page ? req.query.page : 1;
  var limit = 5;

  var query = {
    'name' :  { $regex: keyword, $options: 'i' }
  };

  var options = {
    page: page,
    limit: limit,
    sort: sort
  };

  Item.paginate(query, options)
  .then(function(items) {
    res.render('item_search', {
      title: 'Search results: ' + keyword,
      keyword: keyword,
      item_list: items.docs,
      pageCount: items.pages,
      itemCount: items.total,
      pages: paginate.getArrayPages(req)(3, items.pages, page),
      page: page,
      limit: items.limit,
      sortBy: req.query.sort
    });
  });
}

exports.item_detail = function(req, res, next) {
  req.filter('id').escape();
  req.filter('id').trim();

  Item.findById(req.params.id)
  .populate('category')
  .exec(function (err, item) {
    if (err) { return next(err); }
    // Increment view count and save
    item.view_count++;
    item.save( function(err, updatedItem) {
      if (err) { return next(err); }
      res.render('item_detail', { title: updatedItem.name, item: updatedItem });
    });
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
  console.log(req.body);
  req.checkBody('name', 'Item name must be specified').notEmpty();
  req.checkBody('price', 'Price must be specified').notEmpty();
  req.checkBody('price', 'Price: only floating-point number is allowed').isFloat();
  req.checkBody('category', 'Category must be specified').notEmpty();
  req.checkBody('seller', 'Seller must be specified').notEmpty();
  req.checkBody('lat', 'Latitude must be specified').notEmpty();
  req.checkBody('lat', 'Latitude: only floating-point number is allowed').isFloat();
  req.checkBody('lng', 'Longitude must be specified').notEmpty();
  req.checkBody('lng', 'Longitude: only floating-point number is allowed').isFloat();


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
  req.filter('lat').escape();
  req.filter('lat').trim();
  req.filter('lng').escape();
  req.filter('lng').trim();

  //res.send(req.files);
  //var path = req.files[0].path;
  if (req.files[0])
    var imageName = req.files[0].originalname;
  else
    var imageName = 'question-mark.svg';
  /*var imagepath = {}; //imagepath contains two objects, path and the imageName
  imagepath['path'] = path;
  imagepath['originalname'] = imageName;*/

  var item = new Item({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    description: req.body.description,
    seller: req.body.seller,
    lat: req.body.lat,
    lng: req.body.lng,
    image : imageName
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
  req.checkBody('lat', 'Latitude must be specified').notEmpty();
  req.checkBody('lat', 'Latitude: only floating-point number is allowed').isFloat();
  req.checkBody('lng', 'Longitude must be specified').notEmpty();
  req.checkBody('lng', 'Longitude: only floating-point number is allowed').isFloat();

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
  req.filter('lat').escape();
  req.filter('lat').trim();
  req.filter('lng').escape();
  req.filter('lng').trim();

  //res.send(req.files);
  //var path = req.files[0].path;
  //var imageName = req.files[0].originalname;

  var item = new Item({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    description: req.body.description,
    seller: req.body.seller,
    lat: req.body.lat,
    lng: req.body.lng,
    image: req.files[0].originalname,
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