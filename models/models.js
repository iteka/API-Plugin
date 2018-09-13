const db = require('../controllerts/database');
var ObjectId = require('mongodb').ObjectID;
const config = require('../config.json');

module.exports = {
  FindConsole: function(id, cb) {
    db.get().collection('consoles').findOne({
      consoleGroup: ObjectId(id),
      available: true
    }, function(err, doc) {
      cb(err, doc);
    })
  },

  createSubscript: function(subscript, cb) {
    db.get().collection('subscriptions').insert(subscript, function(err, result) {
      cb(err, result);
    })
  },

  UpdateSubscript: function(id, val, cb) {
    db.get().collection('subscriptions').updateOne({ _id: ObjectId(id) }, {
        $set: {
          available: val
        }
      },
      function(err, docs) {
        cb(err, docs);
      })
  },

  InfoSubscript: function(id, cb) {
    db.get().collection('subscriptions').find({
      user: ObjectId(id)
    }).toArray(function(err, doc) {
      cb(err, doc);
    })
  },

  CreateVpncred: function(vpn, cb) {
    db.get().collection('vpncredentials').insert(vpn, function(err, docs) {
      cb(err, docs);
    })
  },

  UpdateVpncred: function(id, val, cb) {
    db.get().collection('vpncredentials').updateOne({user: ObjectId(id)}, {
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
    db.get().collection('consoles').updateOne({_id: ObjectId(id)}, {
        $set: {
          available: status
        }
      },
      function(err, result) {
        cb(err, result);
      }
    )
  },

  GetVpnKey: function(id, cb) {
    db.get().collection('vpncredentials').findOne({
      user: ObjectId(id)
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
    db.get().collection('payments').updateOne({ _id: ObjectId(id)
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
  },

  paymentscheck: function(uid, cb) {
    db.get().collection('payments').findOne({
      user: ObjectId(uid)
    }, function(err, docs) {
      cb(err, docs);
    })
  }
};
