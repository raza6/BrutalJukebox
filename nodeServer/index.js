const bodyParser = require('body-parser');
const express = require('express');
const Twit = require('twit');
const fs = require('fs');

const twitcred = fs.readFileSync('twitcred.json');
const twitcredjson = JSON.parse(twitcred);

const app = express();
app.use(bodyParser.json());
const twit = new Twit(twitcredjson);

// POST /newsong -> post a tweet
app.post('/newsong', (req, res) => {
  twit.post('statuses/update', { status: req.body.tweet }, (err) => {
    if (err) {
      console.log(`Tweet failed ❌ (${req.body.tweet.slice(25, 50)}...)`);
      res.send(`Tweet failed with ${req.body.tweet}`);
    } else {
      console.log(`Tweet success ✔ (${req.body.tweet.slice(25, 50)}...)`);
      res.send('Tweet success');
    }
  });
});

// GET /ping -> return true if local server is alive
app.get('/ping', (_, res) => {
  res.json(true);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');

  twit.get('account/verify_credentials', { skip_status: true })
    .catch((err) => {
      console.error('Connection to twitter.com failed. Check your credentials.', err.stack);
    })
    .then((result) => {
      console.log(`Connected successfully to twitter account @${result.data.screen_name}`);
    });
});
