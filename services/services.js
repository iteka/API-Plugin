var request = require('request');
var ObjectId = require('mongodb').ObjectID;
const db = require('../controllerts/database');
const Config = require('../config');
var Models = require('../Models/Models');
var Controller = require('../controllerts/controller');

var Dates = new Date().toISOString();


exports.CreateDemo = function(req, res) {
  var IDconsole = req.body.console, UID = req.body.uid,

  Models.CreateVpnKey(`Kedyjjss${UID}`, Config.url.vpn, function(data) {
    if(data !== null){
        return console.log("ERR --", data);
    }
    Models.GetVpnKey(`Kedyjjss${UID}`, Config.url.vpn, function(body) {
      if (body.err) {
        return console.log("ERR --", body);
        return res.sendStatus(500);
      }

      var vpn = {
        "vpnCredentials": body,
        "user": ObjectId(UID)
      };

      Models.vpncredentials(vpn, function(err, result) { // создаем юзеру vpncredentials
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        }
        //  res.send(vpn);
      })
    })
  })

  var Subscripts = {
    "start_date": Dates,
    "end_date": Dates,
    "active": true,
    "console": ObjectId(req.body.console),
    "consolegroup": ObjectId(req.body.consolegroup),
    "user": ObjectId(UID)
  };

  Models.createSubscript(Subscripts, function(err, result) {// создаем subscriptions
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    //  res.send(Subscripts);
  })

  Models.update(IDconsole, false, function(err, result) {// резервируем консоль
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  })

};
