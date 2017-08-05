var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ReviewSchema = Schema({
  item: {type: Schema.ObjectId, ref: 'Item', required: true},
  reviewer: {type: Schema.ObjectId, ref: 'User', required: true},
  review: {type: String, max: 500, required: true},
  rating: {type: Number, min:1, max:5, required: true},
  review_date       : {type: Date},
});

// ReviewSchema
// .virtual('url')
// .get(function(){
//   return '/reviews/' + this_.id;
// });

module.exports = mongoose.model('Review', ReviewSchema);


