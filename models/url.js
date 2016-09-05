var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UrlSchema = new Schema({
  original_url: String,
  slug: {
    type: String,
    index: true,
    unique: true
  }
});

module.exports = mongoose.model('Url', UrlSchema);
