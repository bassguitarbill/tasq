var mongo = require('mongodb');
var Client = mongo.MongoClient;
var ObjectId = mongo.ObjectID;

var assert = require('assert');

var Promise = require('promise');

var url = 'mongodb://127.0.0.1:27017/test';

function findTasks(db, callback) {
   var cursor = db.collection('tasks').find( );
   var returnList = [];
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         returnList.push(doc);
      } else {
         callback(returnList);
      }
   });
};

function execTask(task) {
	Client.connect(url, function(err, db) {
		assert.equal(null, err);
		task(db, function(returnData){console.log(returnData);db.close()});
	});
}

function query(collName, query, callback) {
	Client.connect(url, function(err, db) {
		assert.equal(null, err);
		var cursor = db.collection(collName).find(query);
		var returnList = [];
		cursor.each(function(err, doc) {
			assert.equal(err, null);
			if (doc != null) {
				returnList.push(doc);
			} else {
				callback(returnList); 
				db.close();
			}
		});
	});
};

function getQueryPromise(collName, query) {
	return new Promise(function(resolve, reject){
		Client.connect(url, function(err, db) {
			if(err != null)
				reject(err);
			assert.equal(err, null);
			var cursor = db.collection(collName).find(query);
			var returnList = [];
			cursor.each(function(err, doc) {
				if(err != null)
					reject(err);
				assert.equal(err, null);
				if (doc != null) {
					returnList.push(doc);
				} else {
					db.close();
					resolve(returnList); 
				}
			});
		});
	});
}

//getQueryPromise("tasks", {}).then(function(data){console.log(data);});
module.exports.getQueryPromise = getQueryPromise;

function insert(collName, document, callback) {
	Client.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection(collName).insertOne(
			document,
			function(err, result){db.close();callback(result)}
		);
	});
}

function getInsertPromise(collName, document){
	return new Promise(function(resolve, reject){
		Client.connect(url, function(err, db) {
			if(err != null)
				reject(err);
			assert.equal(null, err);
			db.collection(collName).insertOne(
				document,
				function(err, result){
					db.close();
					resolve(result)
				}
			);
		});
	});
}
module.exports.getInsertPromise = getInsertPromise;

function endActiveTaskPromise() {
	return new Promise(function(resolve, reject){
		Client.connect(url, function(err, db) {
			if(err != null)
				reject(err);
			assert.equal(null, err);
			db.collection('task').updateOne(
				{stopTime: null},
				{$set: {"stopTime": new Date()}},
				function(err, result){
					db.close();
					resolve(result);
				}
			);
		});
	});
}
module.exports.endActiveTaskPromise = endActiveTaskPromise;

function getRemovePromise(collName, query){
	return new Promise(function(resolve, reject){
		Client.connect(url, function(err, db) {
			if(err != null)
				reject(err);
			assert.equal(null, err);
			db.collection(collName).remove(
				query,
				function(err, result){
					db.close();
					resolve(result)
				}
			);
		});
	});
}
module.exports.getRemovePromise = getRemovePromise;

function getTheSundayBefore(input){
	var date = new Date(input);
	date.setMilliseconds(0);
	date.setSeconds(0);
	date.setMinutes(0);
	date.setHours(0);
	date.setTime(date.getTime() - (date.getDay() * 1000 * 60 * 60 * 24));
	return date;
}

function getOneWeekLater(input){
	var date = new Date(input);
	date.setTime(date.getTime() + (1000 * 60 * 60 * 24 * 7));
	return date;
}

function getSurroundingWeekTasksPromise(date){
	return new Promise(function(resolve, reject){
		Client.connect(url, function(err, db) {
			if(err != null)
				reject(err);
			assert.equal(err, null);
			var startTime = getTheSundayBefore(date);
			var endTime = getOneWeekLater(startTime);
			console.log(startTime, endTime);
			var cursor = db.collection('task').find({"startTime" : {'$gte': startTime, '$lte': endTime}});
			var returnList = [];
			cursor.each(function(err, doc) {
				if(err != null)
					reject(err);
				assert.equal(err, null);
				if (doc != null) {
					returnList.push(doc);
				} else {
					db.close();
					resolve(returnList); 
				}
			});
		});
	});
}
module.exports.getSurroundingWeekTasksPromise = getSurroundingWeekTasksPromise;

var allDocuments = function(collName){getQueryPromise(collName,{}).then(function(d){console.log(d)})};
module.exports.allDocuments = allDocuments;
module.exports.insertThenShow = function(collName, document){getInsertPromise(collName, document).then(function(){allDocuments(collName)})};

//Client.connect(url, function(err, db){db.collection('tasks').update({name: 'speedrunning'}, {$rename: {"schedule.perweek":"schedule.perWeek"}});})



/* 
sample activity document:
{ 	
	name: 'practicing',
    desc: 'Practice playing, composing, or recording music',
    color: '#0000ff',
    schedule: { 
		duration: 90, perWeek: 2 
	} 
}

sample task document:
{
	activity: 'programming',
	start: Sat Oct 17 2015 09:29:30 GMT-0400 (Eastern Daylight Time),
	end: Sat Oct 17 2015 10:52:31 GMT-0400 (Eastern Daylight Time),
	goal: 'Improve usability and interface of tasq',
	journal: 'Renamed collections, added update, began web interface'
}
*/
