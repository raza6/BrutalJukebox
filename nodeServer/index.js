const bodyParser = require('body-parser');
const express = require('express');
const Twit = require('twit');

const app = express();
app.use(bodyParser.json());
const twit = new Twit({
  consumer_key: 'XQvvRtPgBhZobgV8FSKPgPG7k',
  consumer_secret: '4telrJap4rKaqNLXhgpBb1cevnIOEyb05aqWvBxAi4LhQpZUlF',
  access_token: '1299110813190574081-DxaiLJ2qGsSpAlMwfWN0Icxn1CzIYb',
  access_token_secret: 'idjILgzTTcJuR5eGTjFmZp46XUo94th1T65i3OPM3mxUC',
});

// POST /newsong -> post a tweet
app.post('/newsong', (req, res) => {
  twit.post('statuses/update', { status: req.body.tweet }, (err) => {
    if (err) {
      console.log('Tweet failed ❌');
      res.send('Tweet failed with', req.body.tweet);
    } else {
      console.log('Tweet success ✔');
      res.send('Tweet success');
    }
  });
});

// GET /ping -> return true if local server is alive
app.get('/ping', (req, res) => {
  res.json(true);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
