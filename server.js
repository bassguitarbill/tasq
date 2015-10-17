var express = require('express');
var app = express();

var db = require('./db');

var PORT = 8080;

app.use(express.static('public'));

app.get('/activities', function (req, res) {
  db.getQueryPromise('activity',{})
	.then(function(d){res.send(d).end();});
});
 
app.listen(PORT);