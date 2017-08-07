var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var moment = require('moment');
URLSlugs = require('mongoose-url-slugs');

var Schema = mongoose.Schema;

var ItemSchema = Schema({
  name         : { type: String, required: true },
  category     : { type: Schema.ObjectId, ref: 'Category', required: true },
  description  : { type: String },
  seller       : { type: Schema.ObjectId, ref: 'User', required: true },
  price        : { type: Number, required: true },
  lat          : { type: Number, required: true },
  lng          : { type: Number, required: true},
  image        : { type: String},
  view_count   : { type: Number, default: 0 },
  rating       : { type: Number, default: 0 },
  review_count : { type: Number, default: 0 },
  price_history: [{ price: { type: Number }, date: { type: Date } }]
});

ItemSchema
.virtual('url')
.get(function() {
  return '/items/' + this.slug;
});

ItemSchema
.virtual('imageUrl')
.get(function() {
  return '/uploads/' + this.image;
});

ItemSchema
.virtual('prices')
.get(function() {
  var result = { prices: [], dates: [] }
  for (var i = 0; i < this.price_history.length; i++) {
    var price = this.price_history[i].price;
    var date  = moment(this.price_history[i].date).fromNow();
    result.prices.push(price);
    result.dates.push(date);
  }
  return result;
});

ItemSchema.plugin(mongoosePaginate);

ItemSchema.plugin(URLSlugs('name'));

module.exports = mongoose.model('Item', ItemSchema);
