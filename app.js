'use strict';

const path = require('path');
const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const newRouter = express.Router();

const app = express();

app.set('port', process.env.PORT || 5000);
app.set(
  'app_url',
  process.env.APP_URL || 'http://localhost:' + app.get('port')
);

app.use('/static', express.static(path.join(__dirname, 'client/build/static')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

newRouter.use(bodyParser.urlencoded({ extended: false }));
newRouter.use(bodyParser.json());

// Create a new Url object, get the original_url from the request, test it's
// validity, and set it on our Url object.
newRouter.use(function(req, res, next) {
  const url = {};
  if (req.method === 'GET') {
    url.original_url = req.query.url || '';
    next();
  } else if (req.method === 'POST') {
    url.original_url = req.body.url;
    next();
  } else {
    res.sendStatus(405);
  }
});

newRouter.use(function(req, res, next) {
  if (!/^(?:http|https):\/\/.+/.test(url.original_url)) {
    res.status(400).json({ error: 'Not a valid url.' });
  } else {
    req.new_url = url;
    next();
  }
});

// Generate a random slug, set it on our Url object, save the Url to database,
// and send our json response.
newRouter.all('/*', function(req, res) {
  req.new_url.slug = crypto
    .randomBytes(3)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  db.putUrl(req.new_url.slug, req.new_url.original_url, function(err, data) {
    if (err) {
      res.status(500).end();
      console.log(err);
    } else {
      res.json({
        original_url: data.original_url,
        short_url: app.get('app_url') + '/' + req.new_url.slug
      });
    }
  });
});

app.use('/new', newRouter);

app.get(/^\/(?:\w|\-){4}$/, function(req, res) {
  const slug = req.originalUrl.match(/^\/(.{4,})/)[1];
  db.getUrl(slug, function(err, data) {
    if (err) {
      res.status(500).end();
      console.log(err);
    } else {
      if (data != null) {
        res.redirect(data.original_url);
      } else {
        res.status(404).send('Slug not found.');
      }
    }
  });
});

if (!process.env.AWS_EXECUTION_ENV) {
  app.listen(app.get('port'), function() {
    console.log('App is listening on port', app.get('port'));
  });
}

module.exports = app;
