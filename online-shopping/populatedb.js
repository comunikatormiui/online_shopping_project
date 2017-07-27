var mongoose = require('mongoose');
var mongoDB = "mongodb://localhost:27017/online-shopping";
mongoose.connect(mongoDB);
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var async = require('async');
var Item = require('./models/item');
var Category = require('./models/category');

var categories = [];
var items = [];

function categoryCreate(name, cb) {
  var category = new Category({ name: name });
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New category: ' + category);
    categories.push(category);
    cb(null, category);
  });
}

function itemCreate(name, category, description, seller, price, image, cb) {
  var item = new Item({
    name: name,
    category: category,
    description: description,
    seller: seller,
    price: price,
    image: image
  });
  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New item: ' + item);
    items.push(item);
    cb(null, item);
  });
}

function createCategories(cb) {
  async.parallel([
    function(callback) {
      categoryCreate('Books', callback); // 0
    },
    function(callback) {
      categoryCreate('Music', callback); // 1
    },
    function(callback) {
      categoryCreate('Movies & TV Shows', callback); // 2
    },
    function(callback) {
      categoryCreate('Electronics', callback); // 3
    },
    function(callback) {
      categoryCreate('Software', callback); // 4
    },
    function(callback) {
      categoryCreate('Video Games', callback); // 5
    },
    function(callback) {
      categoryCreate('Home, Kitchen & Pets', callback); // 6
    },
    function(callback) {
      categoryCreate('Tools & Garden', callback); // 7
    },
    function(callback) {
      categoryCreate('Health, Beauty, & Grocery', callback); // 8
    },
    function(callback) {
      categoryCreate('Toys & Baby', callback); // 9
    },
    function(callback) {
      categoryCreate('Clothing, Shoes & Jewelry', callback); // 10
    },
    function(callback) {
      categoryCreate('Sports & Outdoors', callback); // 11
    },
    function(callback) {
      categoryCreate('Automotive & Industrial', callback); // 12
    }
  ],
  cb);
}
// 0 - Books, 1 - Music, 2 - Movies, 3 - Electronics, 4 - Software, 5 - Video games, 6 - Home
// 7 - Tools, 8 - Health, 9 - Toys, 10 - Clothing, 11 - Sports, 12 - Automotive
// name, category, description, seller, price, image, cb

function createItems(cb) {
  async.parallel([
    function(callback) {
      itemCreate('Sapiens: A Brief History of Humankind', categories[0], '100,000 years ago, at least six species of human inhabited the earth. Today there is just one. Us.Homo Sapiens.', 'Yuval Noah Harari', 14.85, callback);
    },
    function(callback) {
      itemCreate('To The Bone', categories[1], 'Pre-order now.', 'Steven Wilson', 15.25, callback);
    },
    function(callback) {
      itemCreate('GoPro HERO5 Black', categories[3], 'Stunning 4K video and 12MP photos in Single, Burst and Time Lapse modes.', 'GoPro', 529.99, callback);
    },
    function(callback) {
      itemCreate('Office Chair Armrest', categories[6], '100% Brand New', 'SODIAL(R)', 20, callback);
    },
    function(callback) {
      itemCreate('Kaspersky Internet Security 2017', categories[4], 'Defends you against viruses, Internet attacks, fraud, snoopers, cybercriminals & more', 'Kaspersky', 34.99, callback);
    },
    function(callback) {
      itemCreate('American Dad: Volume 4', categories[2], 'This season is among the best. For any American dad fan this season is a must', 'Amazon', 9.99, callback);
    }
  ],
  cb);
}

async.series([
  createCategories,
  createItems
],
function(err, results) {
  if (err) {
    console.log('ERR: ' + err);
  } else {
    console.log('Data sucessfully added');
  }
  mongoose.connection.close();
});
