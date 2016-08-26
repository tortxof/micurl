var express = require('express');
var mongoose = require('mongoose');

var app = express();

app.set('port', (process.env.PORT || 5000));
app.set('app_url', (process.env.APP_URL || 'http://localhost:' + app.get('port')));
app.set('mongo_user', (process.env.MONGO_USER || null));
app.set('mongo_password', (process.env.MONGO_PASSWORD || null));
app.set('mongo_server', (process.env.MONGO_SERVER || 'localhost:27017'));
app.set('mongo_db', (process.env.MONGO_DB || 'micurl'));

(function() {
  var db_uri;
  if (app.get('mongo_user') && app.get('mongo_password')) {
    db_uri = 'mongodb://' +
      app.get('mongo_user') + ':' + app.get('mongo_password') +
      '@' + app.get('mongo_server') + '/' + app.get('mongo_db');
  } else {
    db_uri = 'mongodb://' + app.get('mongo_server') + '/' + app.get('mongo_db');
  }
  mongoose.connect(db_uri);
})();
var Url = require('./models/url');

app.get('/', function(req, res) {
  res.send('Hello.');
});

app.get(/^\/new\/.*/, function(req, res) {
  var url = new Url();
  url.original_url = req.originalUrl.match(/^\/new\/(.*)/)[1];
  url.slug = Math.floor(Math.random() * 1000000);
  if (! /^(?:http|https):\/\/.+\..+/.test(url.original_url)) {
    res.status(400).json({error: 'Not a valid url.'});
    return;
  }
  url.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.json({
        original_url: url.original_url,
        short_url: app.get('app_url') + '/' + url.slug
      });
    }
  });
});

app.get(/^\/\d*/, function(req, res) {
  var slug = parseInt(req.originalUrl.match(/^\/(\d*)/)[1]);
  console.log(slug);
  Url.findOne({slug: slug}, 'original_url', function(err, url) {
    if (err) {
      res.send(err);
    } else if (!url) {
      res.status(404).send('url not found.').end();
    } else {
      res.redirect(url.original_url);
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('App is listening on port', app.get('port'));
});
