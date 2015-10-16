var mongo = require('mongodb');
var Client = mongo.MongoClient;
var ObjectId = mongo.ObjectID;

var assert = require('assert');

var url = 'mongodb://localhost:27017/test';

function findTasks(db, callback) {
   var cursor =db.collection('tasks').find( );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
   });
};

function execTask(task) {
	Client.connect(url, function(err, db) {
		assert.equal(null, err);
		task(db, function(){db.close()});
	});
}

execTask(findTasks); 
