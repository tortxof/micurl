var express = require('express');
var mongodb = require('mongodb');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
  res.send('Hello.');
});

app.get(/^\/new\/.*/, function(req, res) {
  var original_url = req.originalUrl.match(/^\/new\/(.*)/)[1];
  var short_url = '';
  res.json({
    original_url,
    short_url
  });
});

app.listen(app.get('port'), function() {
  console.log('App is listening on port', app.get('port'));
});
