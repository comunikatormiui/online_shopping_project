var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var moment = require('moment');

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
  image_total  : [{ image: { type: String } }],
  view_count   : { type: Number, default: 0 },
  rating       : { type: Number, default: 0 },
  review_count : { type: Number, default: 0 },
  price_history: [{ price: { type: Number }, date: { type: Date } }]
});

ItemSchema
.virtual('url')
.get(function() {
  return '/items/' + this._id;
});

ItemSchema
.virtual('imageUrl')
.get(function() {
  return '/uploads/' + this.image;
});

ItemSchema
.virtual('imageSingleUrl0')
.get(function() {
  if (this.image_total[0]){
    return '/uploads/' + this.image_total[0].image;}
});

ItemSchema
.virtual('imageSingleUrl1')
.get(function() {
    if (this.image_total[1].image)
      return '/uploads/' + this.image_total[1].image;
});

ItemSchema
.virtual('imageSingleUrl2')
.get(function() {
    if (this.image_total[2].image)
      return '/uploads/' + this.image_total[2].image;
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

//store multiple images
ItemSchema
.virtual('max3ImageUpload')
.get(function() {
  var result = { images: [] }
  for (var i = 0; i < this.image_total.length; i++){
    var image = this.image_total[i].image;
    result.images.push(image);
  }
  return result;
});

ItemSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Item', ItemSchema);
