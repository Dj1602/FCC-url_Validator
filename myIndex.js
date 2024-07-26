require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let bodyParser = require('body-parser');
const isUrl = require('is-url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Main API
let count = 0;
const shortendUrl = {};

app.post('/api/shorturl', function(req, res) {
  const url = req.body.url;
  if(!isUrl(url)) {
    res.send({ error: 'invalid url' })
  }
  count = count + 1;
  shortendUrl[count] = url;
  console.log(shortendUrl);
  res.send({ original_url: url, short_url: count })
});

app.get('/api/shorturl/:id', function(req, res) {
  const id = req.params.id;
  const url = shortendUrl[id];
  res.redirect(url)
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
