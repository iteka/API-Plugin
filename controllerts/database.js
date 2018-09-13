const MongoClient = require('mongodb').MongoClient;
var db = null;

exports.connect = function(done) {
  if (db) {
    return done();
  }

  MongoClient.connect(process.env.DB_HOST, function(err, database) {
    if (err) {
      return done(err);
    }
    db = database.db(process.env.DB_NAME);
    done();
  })
}

exports.get = function() {
  return db;
}
