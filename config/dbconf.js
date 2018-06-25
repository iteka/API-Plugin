const MongoClient = require('mongodb').MongoClient;

var state = {
  db: null
};
var conf = {
  name: "IT-API",
  dburl: `mongodb://localhost/${this.name}`
}


exports.connect = function(url, done) {
  if (state.db) {
    return done();
  }

  MongoClient.connect(url, function(err, database) {
    if (err) {
      return done(err);
    }
    state.db = database.db('IT-API');
    done();
  })
}

exports.get = function() {
  return state.db;
}
