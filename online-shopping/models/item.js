var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var ItemSchema = Schema({
  name: { type: String, required: true },
  category: { type: Schema.ObjectId, ref: 'Category', required: true },
  description: { type: String },
  seller: { type: String, required: true }, // will change from string to object later
  price: { type: Number, required: true },
  lat: { type: Number, required: true },
  long: { type: Number, required: true},
  image: { type: String }
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
