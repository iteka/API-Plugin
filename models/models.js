var db = require('../config/dbconf');
var ObjectId = require('mongodb').ObjectID;

exports.all = function (cd) {
    db.get().collection('consoles').find().toArry(function (err, docs){
      cd(err, docs);
    })
}

exports.findID = function (id, cd) {
  db.get().collection('consoles').findOne({ _id: ObjectId(id) }, function (err, doc) {
      cd(err, doc);
    })
}

exports.createSubscript = function (subscript, cd) {
  db.get().collection('subscriptions').insert(subscript, function(err, docs) {
    cd(err, docs);
  })
}

exports.vpncredentials = function (vpn, cd) {
  db.get().collection('vpncredentials').insert(vpn, function(err, docs) {
    cd(err, docs);
  })
}

exports.update = function (id, status, cd) {
  db.get().collection('consoles').updateOne({ _id: ObjectId(id) },  { $set:{ available: status }},
    function (err, result) {
      cd(err, result);
    }
  )
}







//
