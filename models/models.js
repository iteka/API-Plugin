var request = require('request');
const db = require('../controllerts/database');
var ObjectId = require('mongodb').ObjectID;
//

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

exports.updateConsole = function (id, status, cd) {
  db.get().collection('consoles').updateOne({ _id: ObjectId(id) },  { $set:{ available: status }},
    function (err, result) {
      cd(err, result);
    }
  )
}

exports.CreateVpnKey = function(key, url, cd) {
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

exports.Payments = function (payments, cd) {
  db.get().collection('payments').insert(payments, function(err, docs) {
    cd(err, docs);
  })
}




//
