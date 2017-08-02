var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = Schema({
  name: { type: String, required: true },
  category: { type: Schema.ObjectId, ref: 'Category', required: true },
  description: { type: String },
  price: { type: Number, required: true }
});

ItemSchema
.virtual('url')
.get(function() {
  return '/items/' + this._id;
});

module.exports = mongoose.model('Item', ItemSchema);
