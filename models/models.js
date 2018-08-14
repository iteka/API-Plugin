var request = require('request');
const db = require('../controllerts/database');
var ObjectId = require('mongodb').ObjectID;
const config = require('../config.json');

module.exports = {
    all: function(cb) {
      db.get().collection('consoles').find().toArry(function(err, docs) {
        cb(err, docs);
      })
    },

    FindConsole: function(id, cb) { //поиск консолей с consoleGroup
      db.get().collection('consoles').findOne({
        consoleGroup: ObjectId(id),
        available: true
      }, function(err, doc) {
        cb(err, doc);
      })
    },

    createSubscript: function(subscript, cb) {
      db.get().collection('subscriptions').insert(subscript, function(err, docs) {
        cb(err, docs);
      })
    },

    UpdateSubscript: function(id, val, cb) {
      db.get().collection('subscriptions').updateOne({
          _id: ObjectId(id)
        }, {
          $set: {
            available: val
          }
        },
        function(err, docs) {
          cb(err, docs);
        })
    },

    InfoSubscript: function(id, cb) {
      var query = {
        user: ObjectId(id)
      };
      db.get().collection('subscriptions').find(query).toArray(function(err, doc) {
        cb(err, doc);
      })
      // db.get().collection('subscriptions').find({user: ObjectId(user)}).toArry(function (err, doc) {
      //     cb(err, doc);
      //   })
    },

    vpncredentials: function(vpn, cb) {
      db.get().collection('vpncredentials').insert(vpn, function(err, docs) {
        cb(err, docs);
      })
    },

    UpdateVpncredentials: function(id, val, cb) {
      db.get().collection('vpncredentials').updateOne({
          user: ObjectId(id)
        }, {
          $set: {
            active: val
          }
        },
        function(err, result) {
          cb(err, result);
        }
      )
    },

    updateConsole: function(id, status, cb) {
      db.get().collection('consoles').updateOne({
          _id: ObjectId(id)
        }, {
          $set: {
            available: status
          }
        },
        function(err, result) {
          cb(err, result);
        }
      )
    },

    CreateVpnKey: function(uid, cb) {
      try {
        var id = ObjectId(uid);
      } catch (e) {
        return cb('Error 500- ObjectId   String of 12 bytes or a string of 24 hex characters user id ');
      }
      request({
        url: `${config.url.vpn}/api/gencli/`,
        method: "POST",
        json: {
          srv: "inet",
          cli: uid
        }
      }, function(err, httpResponse, body) {
        if (err) {
          return cb(body, httpResponse);
        }
        request.get(`${config.url.vpn}/api/ovpn/${body}@inet`, function(err, httpResponse, body) {
          if (err) {
            return cd(err);
          }
          var data = {
            "active": false,
            "vpnCredentials": body,
            "user": id
          }
          db.get().collection('vpncredentials').insert(data, function(error, docs) {
            cb(error, docs);
          })
        })
      })
    },

    GetVpnKey: function(id, cb) {
      try {
        var id = ObjectId(id);
      } catch (e) {
        return cb('Error 500- ObjectId   String of 12 bytes or a string of 24 hex characters user id ');
      }
      db.get().collection('vpncredentials').findOne({
        user: id
      }, function(err, doc) {
        cb(err, doc);
      })
    },

    Payments: function(payments, cb) {
      db.get().collection('payments').insert(payments, function(err, docs) {
        cb(err, docs);
      })
    },

    PaymentsUpdate: function(id, Pstatus, cb) {
      db.get().collection('payments').updateOne({
          _id: ObjectId(id)
        }, {
          $set: {
            status: Pstatus
          }
        },
        function(err, result) {
          cb(err, result);
        }
      )
    },

    PaymenTtypes: function(id, cb) {
      db.get().collection('paymenttypes').findOne({
        _id: ObjectId(id)
      }, function(err, docs) {
        cb(err, docs);
      })
    },

    FindUser: function(id, cb) {
      db.get().collection('users-permissions_user').findOne({
        _id: ObjectId(id)
      }, function(err, doc) {
        cb(err, doc);
      })
    },

    CheckDemoHistory: function(id, cb) {
      db.get().collection('demohistory').findOne({
        user: ObjectId(id)
      }, function(err, docs) {
        cb(err, docs);
      })
    },

    CreateDemoHistory: function(data, cb) {
      db.get().collection('demohistory').insert(data, function(err, doc) {
        console.log(err, doc);
        cb(err, doc);
      })
    }
};

//
