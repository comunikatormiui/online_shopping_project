var Item = require('../models/item');
var Category = require('../models/category');
var User = require('../models/user');
var Transaction = require('../models/transaction');
var util = require('util');
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
    sort: sort,
    populate: 'seller'
  };

  // Get items and render the view
  Item.paginate({}, options)
  .then(function(items) {
    res.render('item_list', {
      title: 'Items For Sale',
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

exports.wishlist = function(req, res, next) {
  // Get wishlist from current user
  User.findById(req.user._id)
  .populate('local.wishlist')
  .exec(function(err, user) {
    if (err) { return next(err); }
      res.render('wishlist', { title: 'wishlist', wishlist: user.local.wishlist });
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
  .populate('seller').populate('category')
  .exec(function (err, item) {
    if (err) { return next(err); }

    if (req.user != null && item.seller.local.email == req.user.local.email){
      user = 'seller';
    }
    else{
      user = 'buyer';
    }

    // Increment view count and save
    item.view_count++;
    item.save( function(err, updatedItem) {
      if (err) { return next(err); }
      res.render('item_detail', { title: updatedItem.name, item: updatedItem, user : user });
    });
  });
}

exports.item_create_get = function(req, res) {
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

  User.findOne({'local.email': req.user.local.email}, function(err, user){
    if(err){
      throw err;
    }
    if(!user){
      console.log('Invalid email received: ' + req.user.local.email);
      next(err);
    }
    var item = new Item({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      seller: req.body.seller,
      lat: req.body.lat,
      lng: req.body.lng,
      image : imageName,
      seller: user._id
    });

    req.getValidationResult().then(function(result) {
      var errors = result.array();
      if (errors.length > 0) {

        Category.find({}, 'name')
        .exec(function(err, categories) {
          if (err) { return next(err); }
          // add errors to flash
          for (var i = 0; i < errors.length; i++) {
            req.flash('error', errors[i].msg);
          }
          res.locals.error_messages = req.flash('error');

          res.render('item_form', { title: 'Create New Item', item: item, category_list: categories, selected_category: item.category, errors: errors })
        });

      } else {

        item.save(function(err) {
          if (err) {
            throw err;
            next(err);
          }
          res.redirect(item.url);
        });

      }
    });
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
    if (err) {
      next(err);
    }
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

  if (req.files[0])
    var imageName = req.files[0].originalname;
  else
    var imageName = 'question-mark.svg';

  var item = new Item({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    description: req.body.description,
    seller: req.body.seller,
    lat: req.body.lat,
    lng: req.body.lng,
    image: imageName,
    _id: req.params.id
  });

  req.getValidationResult().then(function(result) {
    var errors = result.array();
    if (errors.length > 0) {

      Category.find({}, 'name')
      .exec(function(err, categories) {
        if (err) {
          return next(err);
        }
        // add errors to flash
        for (var i = 0; i < errors.length; i++) {
          req.flash('error', errors[i].msg);
        }
        res.locals.error_messages = req.flash('error');
        
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

exports.item_buy_get = function(req, res, next) {
  req.filter('id').escape();
  req.filter('id').trim();

  Item.findById(req.params.id)
  .populate('seller')
  .exec(function (err, item) {
    if (err) { return next(err); }
    res.render('item_buy', { title: 'Check out', item: item });
    console.log(user);
  });
}


exports.item_buy_post = function(req, res, next) {
  req.checkBody('quantity', 'quantity must be specified').notEmpty();
  req.checkBody('quantity', 'quantity: only integer number is allowed').isInt();
  req.checkBody('ship_address', 'Shipping address must be specified').notEmpty();
  req.checkBody('credit_card_number', 'Credit card number: only integer number is allowed').isInt();
  req.checkBody('cvv', 'CVV must be specified').notEmpty();
  req.checkBody('cvv', 'CVV : only integer number is allowed').isInt();
  req.checkBody('expiry_date', 'expiry date: only date format is allowed').notEmpty().isDate();

  req.filter('quantity').escape();
  req.filter('quantity').trim();
  req.filter('ship_address').escape();
  req.filter('ship_address').trim();
  req.filter('credit_card_number').escape();
  req.filter('credit_card_number').trim();
  req.filter('cvv').escape();
  req.filter('cvv').trim();
  req.filter('expiry_date').escape();
  req.filter('expiry_date').trim();

  User.findOne({'local.email': req.user.local.email}, function(err, user){
    if(err){
      throw err;
    }
    if(!user){
      console.log('Invalid email received: ' + req.user.local.email);
      next(err);
    }
    var currentDate = new Date();
    var transaction = new Transaction({
      buyer: user._id,
      item: req.body.itemid,
      quantity: req.body.quantity,
      ship_address: req.body.ship_address,
      credit_card_number: req.body.credit_card_number,
      cvv: req.body.cvv,
      expiry_date: req.body.expiry_date,
      purchase_date: currentDate
    });
    req.getValidationResult().then(function(result) {
      var errors = result.array();
      if (errors.length > 0) {
        res.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
        return;
      } else {
        transaction.save(function(err) {
          if (err) {
            throw err;
            next(err);
          }
          else{
            res.render('transaction_result', { title: 'Successful' });
          }
        });
      }
    });
  });
};
