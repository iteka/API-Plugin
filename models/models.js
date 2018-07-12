var request = require('request');
const db = require('../controllerts/database');
var ObjectId = require('mongodb').ObjectID;


exports.all = function (cb) {
    db.get().collection('consoles').find().toArry(function (err, docs){
      cb(err, docs);
    })
}

exports.FindConsole = function (id, cb) {//поиск консолей с consoleGroup
  db.get().collection('consoles').findOne({consoleGroup: ObjectId(id), available: true}, function (err, doc) {
      cb(err, doc);
    })
}

exports.createSubscript = function (subscript, cb) {
  db.get().collection('subscriptions').insert(subscript, function(err, docs) {
    cb(err, docs);
  })
}

exports.UpdateSubscript = function (id, val, cb) {
  db.get().collection('subscriptions').updateOne({ _id: ObjectId(id) },  { $set:{ available: val }},
   function(err, docs) {
    cb(err, docs);
  })
}

exports.InfoSubscript = function (id, cb) {
  var query = { user: ObjectId(id) };
  db.get().collection('subscriptions').find(query).toArray(function (err, doc) {
      cb(err, doc);
    })
  // db.get().collection('subscriptions').find({user: ObjectId(user)}).toArry(function (err, doc) {
  //     cb(err, doc);
  //   })
}

exports.vpncredentials = function (vpn, cb) {
  db.get().collection('vpncredentials').insert(vpn, function(err, docs) {
    cb(err, docs);
  })
}

exports.UpdateVpncredentials = function (id, val, cb) {
  db.get().collection('vpncredentials').updateOne({ user: ObjectId(id) },  { $set:{ active: val }},
    function (err, result) {
      cb(err, result);
    }
  )
}

exports.updateConsole = function (id, status, cb) {
  db.get().collection('consoles').updateOne({ _id: ObjectId(id) },  { $set:{ available: status }},
    function (err, result) {
      cb(err, result);
    }
  )
}

exports.CreateVpnKey = function(key, url, cb) {
  request({
    url: `${url}/api/gencli/`,
    method: "POST",
    json: {
      srv: "inet",
      cli: key
    }
  }, function(err, httpResponse, body) {
        if (body.sucess === false) {
          return cd(body, httpResponse);
        }
        cb(err);
  })
}

exports.GetVpnKey = function (key, url, cb) {
  request.get(`${url}/api/ovpn/key${key}@inet`, function(err, httpResponse, body) {
    if (body.sucess === false) {
      return cd(err);
    }
    cb(body);
  })
}

exports.Payments = function (payments, cb) {
  db.get().collection('payments').insert(payments, function(err, docs) {
    cb(err, docs);
  })
}

exports.PaymentsUpdate = function (id, Pstatus, cb) {
  db.get().collection('payments').updateOne({ _id: ObjectId(id) },  { $set:{ status: Pstatus }},
    function (err, result) {
      cb(err, result);
    }
  )
}

exports.PaymenTtypes = function (id, cb) {
  db.get().collection('paymenttypes').findOne({ _id: ObjectId(id) }, function(err, docs) {
    cb(err, docs);
  })
}

exports.FindUser = function (id, cb) {
  db.get().collection('users-permissions_user').findOne({_id: ObjectId(id)}, function (err, doc) {
      cb(err, doc);
    })
}

exports.CheckDemoHistory = function (id, cb) {
  db.get().collection('demohistory').findOne({ user: ObjectId(id) }, function(err, docs) {
    cb(err, docs);
  })
}

exports.CreateDemoHistory = function (data, cb) {
  db.get().collection('demohistory').insert(data, function(err, doc) {
    console.log(err, doc);
    cb(err, doc);
  })
}


//
