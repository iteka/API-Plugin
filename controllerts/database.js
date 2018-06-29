const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
var db = null;

exports.connect = function(url, done) {
  if (db) {
    return done();
  }

  MongoClient.connect(url, function(err, database) {
    if (err) {
      return done(err);
    }
    db = database.db(config.db);
    done();
  })
}

exports.get = function() {
  return db;
}
