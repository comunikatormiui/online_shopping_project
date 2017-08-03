var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var ItemSchema = Schema({
  name        : { type: String, required: true },
  category    : { type: Schema.ObjectId, ref: 'Category', required: true },
  description : { type: String },
  seller      : { type: Schema.ObjectId, ref: 'User', required: true },
  price       : { type: Number, required: true },
  lat         : { type: Number, required: true },
  lng         : { type: Number, required: true},
  image       : { type: String},
  view_count  : { type: Number, default: 0 },
  rating      : { type: Number, default: 0 },
  review_count: { type: Number, default: 0 }
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

ItemSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Item', ItemSchema);
