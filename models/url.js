var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UrlSchema = new Schema({
  original_url: String,
  slug: String
});

module.exports = mongoose.model('Url', UrlSchema);
