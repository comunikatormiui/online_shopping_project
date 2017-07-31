var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt-nodejs');

var transactionSchema = mongoose.Schema({
    buyer: { type: Schema.ObjectId, ref: 'User', required: true },
    item: { type: Schema.ObjectId, ref: 'Item', required: true },
    quantity            : {type: Number, required: true },
    credit_card_number  : {type: String, required: true },
    ship_address			  : {type: String },
    cvv                 : {type: String },
    expiry_date         : {type: Date },
    purchase_date       : {type: Date },
});

transactionSchema
.virtual('url')
.get(function() {
  return '/transaction/' + this._id;
});

module.exports = mongoose.model('transaction', transactionSchema);
