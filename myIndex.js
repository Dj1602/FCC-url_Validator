require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dns = require('dns');
const urlParser= require('url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// POST
const urlDatabase = [];
app.post('/api/shorturl', function (req, res) {
  // get url from input
  const original_url = req.body.url;

  // valid http regex
  const validHttp = /^https?:\/\/[^ "]+$/;

  // test if the input url is valid or not
  if (!validHttp.test(original_url)) {
    return res.json({ error: "invalid url" });
  }
  
  // extract the hostname from the url for validation
  const parsedUrl = urlParser.parse(original_url);
  
  // Check if hostname is valid before dns lookup
  if (!parsedUrl.hostname) {
    return res.json({ error: "invalid url" });
  }

  // lookup the hostname
  dns.lookup(parsedUrl.hostname, (err, data) => {
    if (err) {
      return res.json({ error: "invalid url" })
    }
    // increment the size of the database array by 1
    const shortUrlId = urlDatabase.length + 1;

    // insert the url and the id as objects into the database
    urlDatabase.push({
      original_url: original_url,
      short_url: shortUrlId
    })

    // post the output into json format
    res.json({
      "original_url":original_url,
      "short_url":shortUrlId
    })
  })
})

// GET
app.get('/api/shorturl/:short_url', (req, res) => {
  // get the input short url in number format
  const shortUrlId = Number(req.params.short_url);

  // find the input short url inside the database
  const entry = urlDatabase.find(item => item.short_url === shortUrlId);

  // if it exists
  if (entry) {
    // redirect to the original url using the short url
    res.redirect(entry.original_url);
  } else {
    // if it doesn't
    res.json({
      error: "No entry found!"
    })
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
