var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = Schema({
  name: { type: String, required: true },
  category: { type: Schema.ObjectId, ref: 'Category', required: true },
  description: { type: String },
  seller: { type: String, required: true }, // will change from string to object later
  price: { type: Number, required: true },
  //image: {type: image}
});

ItemSchema
.virtual('url')
.get(function() {
  return '/items/' + this._id;
});

module.exports = mongoose.model('Item', ItemSchema);
