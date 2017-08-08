var mongoSanitize = require('express-mongo-sanitize');
var Category = require('../models/category');
var Item = require('../models/item');
var paginate = require('express-paginate');

var async = require('async');

exports.category_list = function(req, res, next) {
  async.parallel({
    categories: function(callback) {Category.find({}).sort({ name: 'ascending' }).exec(callback);},
    cat_count: function(callback) {Item.aggregate({ '$group': { '_id': '$category', 'count': { '$sum': 1}}}).exec(callback);}
  }, function(err, results) {
      if (err) next(err);
      // add count property to each category object
      var categories = JSON.parse(JSON.stringify(results.categories)); // convert mongoose into json
      for (var i = 0; i < categories.length; i++) {
        var found = false;
        for (var j = 0; j < results.cat_count.length && !found ; j++) {
          if (categories[i]._id == results.cat_count[j]._id) {
            categories[i].count = results.cat_count[j].count;
            found = true;
          }
        }
        if (!found)
          categories[i].count = 0;
      }
      res.render('category_list', { title: 'Categories', category_list: categories });
  });
};

exports.catListForHome = function(req, res, next) {
  async.parallel({
    categories: function(callback) {Category.find({}).sort({ name: 'ascending' }).exec(callback);},
    cat_count: function(callback) {Item.aggregate({ '$group': { '_id': '$category', 'count': { '$sum': 1}}}).exec(callback);},
    items: function(callback) { Item.find({}, 'lat lng name').exec(callback); }
  }, function(err, results) {
      if (err) next(err);
      // add count property to each category object
      var categories = JSON.parse(JSON.stringify(results.categories)); // convert mongoose into json
      for (var i = 0; i < categories.length; i++) {
        var found = false;
        for (var j = 0; j < results.cat_count.length && !found ; j++) {
          if (categories[i]._id == results.cat_count[j]._id) {
            categories[i].count = results.cat_count[j].count;
            found = true;
          }
        }
        if (!found)
          categories[i].count = 0;
      }
      res.render('index', { title: 'Our Shopping Page', catListForHome: results.categories, items: results.items });
  });
};

exports.category_detail = function(req, res, next) {
  req.filter('id').escape();
  req.filter('id').trim();
  req.sanitizeQuery('sort').escape();
  req.sanitizeQuery('sort').trim();


  // Default is relevant
  var sort = { view_count: 'desc' };
  if (req.query.sort=='price-asc') { sort = { price: 'asc' } }
  else if (req.query.sort=='price-desc') { sort = { price: 'desc' } }

  var page = req.query.page ? req.query.page : 1;
  var limit = 5;

  mongoSanitize.sanitize(req.params);

  var options = {
    page: page,
    limit: limit,
    sort: sort,
    populate: ['seller', 'category']
  };
  var category_slug = mongoSanitize.sanitize(req.params.id);
  Category.findOne({'slug' : category_slug})
      .exec(function(err, category) {
        if (err) {
            next(err);
            return;
        }
        else if(!category){
            req.flash('error', 'Category does not exists.');
            res.redirect('/categories');
            return;
        }
        var query = {
            category : category._id
        };
        Item.paginate(query, options, function(err, items){
          if (err) {
              next(err);
              return;
          }
          res.render('category_detail', {
              title: category.name,
              item_list: items.docs,
              cat_name: 'Category: ' + category.name,
              pageCount: items.pages,
              itemCount: items.total,
              pages: paginate.getArrayPages(req)(3, items.pages, page),
              page: page,
              limit: items.limit,
              sortBy: req.query.sort // could be null
          });
        });
    });
}
