'use strict';

const path = require('path');
const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');

const newRouter = express.Router();

const app = express();

app.set('app_name', process.env.APP_NAME || 'micurl');
app.set('port', process.env.PORT || 5000);
app.set(
  'app_url',
  process.env.APP_URL || 'http://localhost:' + app.get('port')
);
app.set('views', './views');
app.set('view engine', 'ejs');

app.use('/static', express.static(path.join(__dirname, 'client/build/static')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

newRouter.use(bodyParser.urlencoded({ extended: false }));
newRouter.use(bodyParser.json());

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
  if (!/^(?:http|https):\/\/.+\..+/.test(url.original_url)) {
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
  res.send(slug);
});

app.listen(app.get('port'), function() {
  console.log('App is listening on port', app.get('port'));
});
