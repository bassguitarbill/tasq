var mongo = require('mongodb');
var Client = mongo.MongoClient;
var ObjectId = mongo.ObjectID;

var assert = require('assert');

var Promise = require('promise');

var url = 'mongodb://localhost:27017/test';

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

getQueryPromise("tasks", {}).then(function(data){console.log(data);});
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
