'use strict';

const crypto = require('crypto');
const express = require('express');
const newRouter = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer')();
const mongoose = require('mongoose');

const app = express();

app.set('app_name', (process.env.APP_NAME || 'micurl'));
app.set('port', (process.env.PORT || 5000));
app.set('app_url', (process.env.APP_URL || 'http://localhost:' + app.get('port')));
app.set('mongo_user', (process.env.MONGO_USER || null));
app.set('mongo_password', (process.env.MONGO_PASSWORD || null));
app.set('mongo_server', (process.env.MONGO_SERVER || 'localhost:27017'));
app.set('mongo_db', (process.env.MONGO_DB || 'micurl'));

app.use('/static', express.static(__dirname + '/static'));

app.set('views', './views')
app.set('view engine', 'pug');

(function() {
  let db_uri;
  if (app.get('mongo_user') && app.get('mongo_password')) {
    db_uri = 'mongodb://' +
      app.get('mongo_user') + ':' + app.get('mongo_password') +
      '@' + app.get('mongo_server') + '/' + app.get('mongo_db');
  } else {
    db_uri = 'mongodb://' + app.get('mongo_server') + '/' + app.get('mongo_db');
  }
  mongoose.connect(db_uri);
})();
const Url = require('./models/url');

app.get('/', function(req, res) {
  res.render(
    'index',
    {
      app_url: app.get('app_url'),
      app_name: app.get('app_name')
    }
  );
});

newRouter.use(bodyParser.urlencoded({ extended: false }));
newRouter.use(bodyParser.json());
newRouter.use(multer.none());

// Create a new Url object, get the original_url from the request, test it's
// validity, and set it on our Url object.
newRouter.use(function(req, res, next) {
  const url = new Url();
  if (req.method === 'GET') {
    url.original_url = req.query.url || '';
  } else if (req.method === 'POST') {
    url.original_url = req.body.url;
  } else {
    res.status(404).send('Bad request method.');
  }
  if (! /^(?:http|https):\/\/.+\..+/.test(url.original_url)) {
    res.status(400).json({error: 'Not a valid url.'});
  } else {
    req.new_url = url;
    next();
  }
});

// Generate a random slug, set it on our Url object, save the Url to database,
// and send our json response.
newRouter.all('/*', function(req, res) {
  req.new_url.slug = crypto.randomBytes(3).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  req.new_url.save(function(err) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({
        original_url: req.new_url.original_url,
        short_url: app.get('app_url') + '/' + req.new_url.slug
      });
    }
  });
});

app.use('/new', newRouter);

app.get(/^\/(?:\w|\-){4}/, function(req, res) {
  const slug = req.originalUrl.match(/^\/(.{4,})/)[1];
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
