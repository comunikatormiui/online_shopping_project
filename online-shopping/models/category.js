var mongoose = require('mongoose');
URLSlugs = require('mongoose-url-slugs');

var Schema = mongoose.Schema;

var CategorySchema = Schema({
    name: { type: String, required: true }
});

CategorySchema
.virtual('url')
.get(function () {
    return '/categories/' + this.slug;
})

CategorySchema.plugin(URLSlugs('name'));

module.exports = mongoose.model('Category', CategorySchema);