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
    cd(err, docs);
  })
}

exports.vpncredentials = function (vpn, cb) {
  db.get().collection('vpncredentials').insert(vpn, function(err, docs) {
    cd(err, docs);
  })
}

exports.UpdateVpncredentials = function (id, val, cb) {
  db.get().collection('vpncredentials').updateOne({ _id: ObjectId(id) },  { $set:{ active: val }},
    function (err, result) {
      cd(err, result);
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
        cd(err);
  })
}

exports.GetVpnKey = function (key, url, cd) {
  request.get(`${url}/api/ovpn/key${key}@inet`, function(err, httpResponse, body) {
    if (body.sucess === false) {
      return cd(err);
    }
    cd(body);
  })
}

exports.Payments = function (payments, cb) {
  db.get().collection('payments').insert(payments, function(err, docs) {
    cb(err, docs);
  })
}

exports.PaymentsUpdate = function (id, Pstatus, cd) {
  db.get().collection('payments').updateOne({ _id: ObjectId(id) },  { $set:{ status: Pstatus }},
    function (err, result) {
      cd(err, result);
    }
  )
}

exports.PaymenTtypes = function (id, cd) {
  db.get().collection('paymenttypes').findOne({ _id: ObjectId(id) }, function(err, docs) {
    cd(err, docs);
  })
}

exports.Notifications = function (noti, cb) {
  db.get().collection('notifications').insert(noti, function(err, docs) {
    cb(err, docs);
  })
}

exports.FindNotify = function (user, cb) {
  db.get().collection('notifications').findOne({ user: ObjectId(user) }, function(err, docs) {
    cb(err, docs);
  })
}



//
