var express = require("express");
var Twit = require("twit");
var app = express();
var twit = new Twit({
	consumer_key: 'XQvvRtPgBhZobgV8FSKPgPG7k',
	consumer_secret: '4telrJap4rKaqNLXhgpBb1cevnIOEyb05aqWvBxAi4LhQpZUlF',
	access_token: '1299110813190574081-DxaiLJ2qGsSpAlMwfWN0Icxn1CzIYb',
	access_token_secret: 'idjILgzTTcJuR5eGTjFmZp46XUo94th1T65i3OPM3mxUC',
});

twit.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
  console.log(data)
});

app.get("/ping", (req, res, next) => {
	res.json(true);
});

app.listen(3000, () => {
	console.log("Server running on port 3000");
});
