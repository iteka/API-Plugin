const Models   = require('../models/models');
const ObjectId = require('mongodb').ObjectID;
const Config   = require('../config.json');
const Loger    = require('../log/loger');
const axios    = require('axios');
const Urss     = require('../user/service');

var Dates = new Date().toISOString();

module.exports = {
  FindConsole: (req, res, next) => {
    Models.FindConsole(req.body.id, function(err, doc) {
      if (err) {
        return next(err);
      }
      res.send(doc);
    })
  },

  createSubscript: (req, res, next) => {
    var Subscripts = {
      "start_date": Dates,
      "end_date": Dates,
      "active": false,
      "console": ObjectId(req.body.console),
      "consolegroup": ObjectId(req.body.consolegroup),
      "user": ObjectId(req.body.id)
    };
    Models.createSubscript(Subscripts, function(err, result) {
      if (err) {
        return next(err);
      }
      res.send(Subscripts);
    });
  },

  updateConsole: (req, res, next) => {
    Models.updateConsole(req.params.id, false, function(err, result) {
      if (err) {
        return next(err);
      }
      res.sendStatus(200);
    })
  },

  UpdateVpncredentials: (req, res, next) => {
    Models.UpdateVpncred(req.params.id, req.params.val, function(err, result) {
      if (err) {
        return next(err);
      }
      res.sendStatus(200);
    })
  },

  NotificationsFind: (req, res, next) => {
    Models.FindNotify(req.body.user, function(err, result) {
      if (err) {
        next(err);
      }
      if (result == null) {
        res.send("null");
      } else {
        res.send(result);
      }
    });
  },

  FindUser: (req, res, next) => {
    Models.FindUser(req.body.id, function(err, result) {
      if (err) {
        return next(err);
      }
      return result;
    })
  },

  CreateDemoHistory: (req, res, next) => {
    var data = {
      "fingerprint": req.body.fprint,
      "user": ObjectId(req.body.uid),
      "createdAt": new Date().toISOString()
    }
    Models.CreateDemoHistory(data, function(err, result) {
      if (err) {
        return next(err);
      }
      return res.sendStatus(200);
    });
  },

  CheckDemoHistory: (req, res, next) => {
    Models.CheckDemoHistory(req.params.uid, function(err, doc) {
      if (err) {
        return next(err);
      }
      if (doc !== null) { //-res.json
        return res.json(false);
      } else { //+
        return res.json(true);
      }
    });
  },

  //******* VPN *******//
  CreateVpnKey: (uid, cb) => {
    axios({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: { srv: "inet", cli: uid },
        url: `${Config.VPN}/api/gencli/`
        })
        .then(function(response) {
          axios.get(`${Config.VPN}/api/ovpn/${uid}@inet`)
            .then(function(response) {
              const vpn = {
                active: false,
                vpnCredentials: response,
                user: ObjectId(uid)
              };
              Models.CreateVpncred(vpn, function(err, result) {
                if (err) {
                  return cb(err);
                }
                return ("OK");
              })
            })
            .catch(function(error) {
              cb(error);
            })
          })
      .catch(function(error) {
        cb(error);
    })
  },

  GetVpnKey: (req, res, next) => {
    const uid = Urss.JWTgetUid(req);
      Models.GetVpnKey(uid, function(err, doc) {
        if (err || doc == null) {
          return next(err);
        }
      res.send(doc.vpnCredentials);
    })
  },

  Version:  (req, res) => {
    if(req.params.ver !== Config.app.Version){
      res.json( {"Version": Config.app.Version, "url": Config.app.url} );
    }else {
      res.send("ok");
    }
  },

  paystatus:  (req, res, next) => {
    const uid = Urss.JWTgetUid(req);
    Models.paymentscheck(uid, function (err, doc) {
      if(err || doc == null){
        return next(err);
      }
        res.send(doc.status);
    });
  }
}
