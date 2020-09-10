var express = require("express");
var app = express();

app.get("/ping", (req, res, next) => {
	res.json(true);
});

app.listen(3000, () => {
	console.log("Server running on port 3000");
});
