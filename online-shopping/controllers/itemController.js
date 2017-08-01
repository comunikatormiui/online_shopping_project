var Item = require('../models/item');
var Category = require('../models/category');
var User = require('../models/user');
var Transaction = require('../models/transaction');
var Review = require('../models/review');
var util = require('util');

var async = require('async');


exports.item_list = function(req, res, next) {
  Item.find({}, 'name seller')
  .populate('seller')
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
  .populate('seller').populate('category')
  .exec(function (err, item) {
    if (err) { return next(err); }
    if (req.user != null && item.seller.local.email == req.user.local.email){
      user = 'seller';
    }
    else{
      user = 'buyer';
    }
    console.log('req.params.id:' + req.params.id);
    Review.find({item: req.params.id})
    .populate('reviewer')
    .exec(function (err, list_reviews){
      if (err){return next(err);}
      res.render('item_detail', { title: item.name, item: item, user : user, review_list: list_reviews});
      console.log(list_reviews);
      console.log(user);
    });
  });
}

exports.item_create_get = function(req, res) {
  Category.find({}, 'name')
  .sort({ name: 'ascending' })
  .exec(function(err, categories) {
    if (err) {
      next(err);
    }
    res.render('item_form', { title: 'Create New Item', category_list: categories });
  });
};

exports.item_create_post = function(req, res, next) {
  req.checkBody('name', 'Item name must be specified').notEmpty();
  req.checkBody('price', 'Price must be specified').notEmpty();
  req.checkBody('price', 'Price: only floating-point number is allowed').isFloat();
  req.checkBody('category', 'Category must be specified').notEmpty();

  req.filter('name').escape();
  req.filter('name').trim();
  req.filter('price').escape();
  req.filter('price').trim();
  req.filter('category').escape();
  req.filter('category').trim();
  req.filter('description').escape();
  req.filter('description').trim();

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
      seller: user._id
    });
    req.getValidationResult().then(function(result) {
      var errors = result.array();
      if (errors.length > 0) {
        Category.find({}, 'name')
        .exec(function(err, categories) {
          if (err) {
            return next(err);
          }
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
        if (err) {
          return next(err);
        }
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
}

  exports.item_review_post = function(req, res, next) {
    req.checkBody('item', 'Item name must be specified').notEmpty();
    req.checkBody('rating', 'rating must be specified').notEmpty().isInt();


    req.filter('item').escape();
    req.filter('item').trim();
    req.filter('review').escape();
    req.filter('review').trim();
    req.filter('rating').escape();
    req.filter('rating').trim();

    User.findOne({'local.email': req.user.local.email}, function(err, user){
      if(err){
        throw err;
      }
      if(!user){
        console.log('Invalid email received: ' + req.user.local.email);
        next(err);
      }
      var itemID = req.params.id;
      Item.findById(itemID)
      .populate('seller')
      .exec(function (err, item) {
        if (err) { return next(err); }
        if (req.user != null && item.seller.local.email == req.user.local.email){
          //res.render('item_detail', { title: item.name, item: item, user : 'seller',
          //                            error : 'Seller cannot rate his/her own item.'});
          res.redirect(item.url);
          return;
        }
        var currentDate = new Date();
        var review = new Review({
          item: itemID,
          reviewer: user._id,
          review: req.body.review,
          rating: req.body.rating,
          review_date: currentDate
        });
        review = review.toObject();
        console.log(review);
        delete review["_id"];
        console.log(review);
        console.log(review._id);

        Review.findOneAndUpdate({'item': itemID, 'reviewer': user._id}, review,
          {upsert:true}, function(err, review){
            if(err){
              //res.render('item_detail', { title: item.name, item: item, user : 'buyer',
              //                            error : 'Failed to add your review. Please try again.'});
              console.log(err);
              res.redirect(item.url);
            }
            else {
              res.redirect(item.url);
            }
        });
    });
  });
}
