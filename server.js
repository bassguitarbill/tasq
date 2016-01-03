var express = require('express');
var app = express();

var bodyParser = require('body-parser')

var db = require('./db');

var PORT = 8080;

app.use(express.static('public'));

app.get('/activities', function (req, res) {
	db.getQueryPromise('activity',{})
		.then(function(d){res.send(d).end();});
});

app.get('/active-task', function (req, res) {
	db.getQueryPromise('task',{stopTime: null})
		.then(function(d){res.send(d).end();});
});

app.post('/end-task', function (req, res) {
	db.endActiveTaskPromise()
		.then(function(d){res.send(d).end();});
});

app.use(bodyParser.urlencoded({ extended: false }));
app.post('/log', function (req, res) {
	console.log(req.body);
	if(!req.body || !req.body.activity){
		res.statusCode = 400;
		res.send('No activity provided').end();
	} else {
		var log = {
			activity: req.body.activity,
			start: req.body.start || new Date(),
			stop: req.body.stop || null,
			goal: req.body.goal || "",
			journal: req.body.journal || null
		};
		db.getInsertPromise('task',req.body)
			.then(function(d){res.send(d).end();});
	}
});

app.post('/addActivity', function (req, res) {
	console.log(req.body);
	if(!req.body){
		res.statusCode = 400;
		res.send('No activity provided').end();
	} else {
		db.getInsertPromise('activity',req.body)
			.then(function(d){res.send(d).end();});
	}
});

app.post('/deleteActivity', function (req, res) {
	console.log(req.body);
	if(!req.body){
		res.statusCode = 400;
		res.send('No activity provided').end();
	} else {
		db.getRemovePromise('activity',req.body)
			.then(function(d){res.send(d).end();});
	}
});

app.post('/alg1', function (req, res) {
	console.log(req.body);
	if(!req.body){
		res.statusCode = 400;
		res.send('No activity provided').end();
	} else {
	console.log(req.body.date);
		db.getSurroundingWeekTasksPromise(req.body.date)
			.then(function(d){res.send(d).end();});
	}
});
	
 
app.listen(PORT);